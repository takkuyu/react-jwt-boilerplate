## What are the options?
When moving your JWTs out of local storage, there are two options I recommend:

1. Browser memory (React state)
2. HttpOnly cookie

The first option is the more secure one because putting the JWT in a cookie doesn’t completely remove the risk of token theft. Even with an HttpOnly cookie, sophisticated attackers can still use XSS and CSRF to steal tokens or make requests on the user’s behalf.

However, the first option isn’t always very practical. That’s because storing a JWT in your React state will cause it to be lost any time the page is refreshed or closed and then opened again. This leads to a poor user experience––you don’t want your users to need to log back in every time they refresh the page.

If you’re using a third-party authentication service like Auth0 or Okta, this isn’t a big deal because you can just call for another token behind the scenes (using a prompt=none call) to get a new token on refresh. However, this relies on a central auth server that is storing a session for your users.
The same isn’t true if you’re rolling your own auth. In that case, you most likely have a completely stateless backend that just signs tokens and validates them at your API. If you’re using refresh tokens, Hasura has a great guide on how you can keep your access tokens in app state and refresh tokens in a cookie.

If you aren’t able to keep your JWTs in app state, then the second option still offers some benefits. Most notably, if your app has any XSS vulnerabilities, attackers will not be able to steal your users’ tokens as easily.
Putting your tokens in HttpOnly cookies is not a silver bullet though. Like any secure app, you need to effectively guard against both XSS and CSRF vulnerabilities. Ben Awad as a great video going into more detail.

Source: https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81
