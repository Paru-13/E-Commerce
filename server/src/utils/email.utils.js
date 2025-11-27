export const registerSuccessEmail = () => {
  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.08);">

      <h2 style="text-align: center; color: #333;">🎉 Account Created Successfully!</h2>

      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        Hi there,<br><br>
        Your account has been successfully created. You can now log in and start using our services.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href=${process.env.FRONTEND_URL}/auth/>login
           style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none;
                  border-radius: 5px; font-size: 16px; display: inline-block;">
          Login Now
        </a>
      </div>

      <p style="color: #777; font-size: 13px; text-align: center;">
        If you didn’t create this account, you can safely ignore this email.
      </p>

    </div>
  </div>
  `;
  return html;
};
