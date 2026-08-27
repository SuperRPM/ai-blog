import { NextRequest, NextResponse } from "next/server";

function popupHtml(payload: { success: boolean; token?: string; error?: string }) {
  const message = payload.success
    ? `authorization:github:success:${JSON.stringify({ token: payload.token, provider: "github" })}`
    : `authorization:github:error:${JSON.stringify({ message: payload.error })}`;

  return `<!DOCTYPE html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return new NextResponse(popupHtml({ success: false, error: "missing code or client credentials" }), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${req.nextUrl.origin}/api/callback`,
    }),
  });

  const data = await tokenRes.json();

  if (!data.access_token) {
    return new NextResponse(popupHtml({ success: false, error: data.error_description || "token exchange failed" }), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(popupHtml({ success: true, token: data.access_token }), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
