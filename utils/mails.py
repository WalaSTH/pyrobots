from enum import Enum

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

from Database.Database import User

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
    recover_type: RecoverType
):
    body = { "username": user.user_name, "email": email }

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
