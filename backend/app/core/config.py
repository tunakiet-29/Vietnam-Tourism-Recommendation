from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_version: str

    database_url: str

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int

    vnpay_tmn_code: str
    vnpay_hash_secret: str
    vnpay_payment_url: str
    vnpay_return_url: str
    vnpay_ipn_url: str
    payment_expire_minutes: int = 15
    payment_expiry_check_interval_seconds: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
