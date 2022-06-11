import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :test_api, TestApiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "SRwmLr7NGqu6a70F3g636ECNK0IiO4cQnQaClP2WUSU3liG1t3RUqc3mAzrRU26l",
  server: false

# In test we don't send emails.
config :test_api, TestApi.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
