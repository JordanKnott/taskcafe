# Remote authorize
If you need to authenticate user with some proxy, you should use
```toml
[server]
remote_user_header = "X-Remote-User"
```
With this option Taskcafe will take username from
`X-Remote-User` HTTP header and will not check its password.
You can use any header you want.