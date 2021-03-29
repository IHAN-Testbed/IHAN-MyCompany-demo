# IHAN My Company backend

## Development

Additional dependencies:

- [Python >=3.9](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org)

To install the dependencies:

```bash
poetry install
```

If you need authentication to work locally, you'll need to configure the
`OPENID_CONNECT_CLIENT_ID` and `OPENID_CONNECT_CLIENT_SECRET` environment variables. You
might need to setup other variables for backend to work properly.

```bash
export OPENID_CONNECT_CLIENT_ID="clientid"
export OPENID_CONNECT_CLIENT_SECRET="topsecret"
```

Then to run the code:

```bash
poetry run invoke dev
```

Or to run the tests:

```bash
poetry run invoke test
```
