import gql from 'graphql-tag';
import isValidEmail from 'shared/utils/email';

type MemberFilterOptions = {
  projectID?: null | string;
  teamID?: null | string;
  organization?: boolean;
};

export default async function(client: any, projectID: string, options: MemberFilterOptions, input: string, cb: any) {
  if (input && input.trim().length < 3) {
    return [];
  }
  const res = await client.query({
    query: gql`
    query {
      searchMembers(input: {searchFilter:"${input}", projectID:"${projectID}"}) {
        id
        similarity
        status
        user {
          id
          fullName
          email
          profileIcon {
            url
            initials
            bgColor
          }
        }
      }
    }
    `,
  });

  let results: any = [];
  const emails: Array<string> = [];
  if (res.data && res.data.searchMembers) {
    results = [
      ...res.data.searchMembers.map((m: any) => {
        if (m.status === 'INVITED') {
          return {
            label: m.id,
            value: {
              id: m.id,
              type: 2,
              profileIcon: {
                bgColor: '#ccc',
                initials: m.id.charAt(0),
              },
            },
          };
        }

        emails.push(m.user.email);
        return {
          label: m.user.fullName,
          value: { id: m.user.id, type: 0, profileIcon: m.user.profileIcon },
        };
      }),
    ];
  }

  if (isValidEmail(input) && !emails.find(e => e === input)) {
    results = [
      ...results,
      {
        label: input,
        value: {
          id: input,
          type: 1,
          profileIcon: {
            bgColor: '#ccc',
            initials: input.charAt(0),
          },
        },
      },
    ];
  }

  return results;
}
