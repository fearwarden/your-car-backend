export let template = (email: string, link: string) => {
  return `<div>
        <h1>Dear ${email},</h1>
        <p>You recently requested to reset the password. Click the link below to proceed.<br>Link: ${link}</p>
    </div>`;
};
