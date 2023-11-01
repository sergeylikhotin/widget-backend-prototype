export const getMailTemplate = (content: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        ${content}
      </body>
    </html>`;
};

export const getRegisterLinkHtml = (link: string) => {
  const codeHtml = `
  <div
    style="width: 100%; height: 100%; padding: 20px"
  >
    <h4>Your verification code:</h4>
    <a style="font-weight: 800;" href="${link}">${link}</a>
  </div>`;
  return getMailTemplate(codeHtml);
};
