import React, { useRef, useState, useEffect } from 'react';
import {
  CommentTextArea,
  CommentEditorContainer,
  CommentEditorActions,
  CommentEditorActionIcon,
  CommentEditorSaveButton,
  CommentProfile,
  CommentInnerWrapper,
} from './Styles';
import { usePopup } from 'shared/components/PopupMenu';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { At, Paperclip, Smile } from 'shared/icons';
import { Picker, Emoji } from 'emoji-mart';
import Task from 'shared/icons/Task';

type CommentCreatorProps = {
  me?: TaskUser;
  autoFocus?: boolean;
  onMemberProfile?: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
  message?: string | null;
  onCreateComment: (message: string) => void;
  onCancelEdit?: () => void;
};

const CommentCreator: React.FC<CommentCreatorProps> = ({
  me,
  message,
  onMemberProfile,
  onCreateComment,
  onCancelEdit,
  autoFocus = false,
}) => {
  const $commentWrapper = useRef<HTMLDivElement>(null);
  const $comment = useRef<HTMLTextAreaElement>(null);
  const $emoji = useRef<HTMLDivElement>(null);
  const $emojiCart = useRef<HTMLDivElement>(null);
  const [comment, setComment] = useState(message ?? '');
  const [showCommentActions, setShowCommentActions] = useState(autoFocus);
  const { showPopup, hidePopup } = usePopup();
  useEffect(() => {
    if (autoFocus && $comment && $comment.current) {
      $comment.current.select();
    }
  }, []);
  useOnOutsideClick(
    [$commentWrapper, $emojiCart],
    showCommentActions,
    () => {
      if (onCancelEdit) {
        onCancelEdit();
      }
      setShowCommentActions(false);
    },
    null,
  );
  return (
    <CommentInnerWrapper ref={$commentWrapper}>
      {me && onMemberProfile && (
        <CommentProfile
          member={me}
          size={32}
          onMemberProfile={$target => {
            onMemberProfile($target, me.id);
          }}
        />
      )}
      <CommentEditorContainer>
        <CommentTextArea
          showCommentActions={showCommentActions}
          placeholder="Write a comment..."
          ref={$comment}
          value={comment}
          onChange={e => setComment(e.currentTarget.value)}
          onFocus={() => {
            setShowCommentActions(true);
          }}
        />
        <CommentEditorActions visible={showCommentActions}>
          <CommentEditorActionIcon>
            <Paperclip width={12} height={12} />
          </CommentEditorActionIcon>
          <CommentEditorActionIcon>
            <At width={12} height={12} />
          </CommentEditorActionIcon>
          <CommentEditorActionIcon
            ref={$emoji}
            onClick={() => {
              showPopup(
                $emoji,
                <div ref={$emojiCart}>
                  <Picker
                    onClick={emoji => {
                      console.log(emoji);
                      if ($comment && $comment.current) {
                        let textToInsert = `${emoji.colons} `;
                        let cursorPosition = $comment.current.selectionStart;
                        let textBeforeCursorPosition = $comment.current.value.substring(0, cursorPosition);
                        let textAfterCursorPosition = $comment.current.value.substring(
                          cursorPosition,
                          $comment.current.value.length,
                        );
                        setComment(textBeforeCursorPosition + textToInsert + textAfterCursorPosition);
                      }
                      hidePopup();
                    }}
                    set="google"
                  />
                </div>,
              );
            }}
          >
            <Smile width={12} height={12} />
          </CommentEditorActionIcon>
          <CommentEditorActionIcon>
            <Task width={12} height={12} />
          </CommentEditorActionIcon>
          <CommentEditorSaveButton
            onClick={() => {
              setShowCommentActions(false);
              onCreateComment(comment);
              setComment('');
            }}
          >
            Save
          </CommentEditorSaveButton>
        </CommentEditorActions>
      </CommentEditorContainer>
    </CommentInnerWrapper>
  );
};

export default CommentCreator;
