from enum import Enum
import sys

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

from Database.Database import User
from utils.auth import RESET_PASSWORD_TOKEN_EXPIRE_MINUTES, VALIDATE_TOKEN_EXPIRE_MINUTES

conf = ConnectionConfig(
    MAIL_USERNAME = "noreplypyrobots@gmail.com",
    MAIL_PASSWORD = "mkqueawhnzygphox",
    MAIL_FROM = "noreplypyrobots@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="PyRobots",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True,
    TEMPLATE_FOLDER='./templates/email'
)

class RecoverType(str, Enum):
    USERNAME = "username"
    PASSWORD = "password"


async def send_recovery_email(
    email: EmailStr,
    user: User,
    recover_type: RecoverType,
    token: str
):
    body = { "username": user.user_name, "email": email, "token": token, "expiration": RESET_PASSWORD_TOKEN_EXPIRE_MINUTES }

    if (recover_type is RecoverType.USERNAME):
        subject = "Recover Username"
        template = "recover_username.html"
    elif (recover_type is RecoverType.PASSWORD):
        subject = "Reset Password"
        template = "reset_password.html"

    message = MessageSchema(
        subject = subject,
        recipients = [email],
        template_body = body,
        subtype = MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message, template_name=template)

async def send_verification_email(
    email: EmailStr,
    username: str,
    token: str
):
    if "pytest" in sys.modules:
        print("Sending email...")
        return

    body = {
        "username": username,
        "email": email,
        "token": token,
        "expiration": VALIDATE_TOKEN_EXPIRE_MINUTES // 60
    }

    message = MessageSchema(
        subject = "Validate Account",
        recipients = [email],
        template_body = body,
        subtype = MessageType.html
    )

    fm = FastMail(conf)

    await fm.send_message(message, template_name="validate_account.html")
