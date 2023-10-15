class SpotifyClient {
  client_id = "";
  client_secret = "";
  access_token = "";
  expires_at = "";
  BASE_URL = "https://api.spotify.com/v1";

  constructor(client_id, client_secret) {
    if (!client_id || !client_secret)
      throw new Error("Missing required params, client_id and client_secret");
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.grantClientCredentials();
  }

  async resetToken() {
    if (new Date().getTime() >= this.expires_at) {
      await this.grantClientCredentials();
    }
  }

  async grantClientCredentials() {
    const BASE_URL = "https://accounts.spotify.com/api/token";

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${this.client_id}&client_secret=${this.client_secret}`,
    });
    const body = await res.json();
    this.access_token = body.access_token;
    const hours = body.expires_in / 3600;
    this.expires_at = new Date().setHours(new Date().getHours() + hours);
    console.log("Access token: ", this.access_token);

    console.log("Currnet time: ", new Date().getTime());
    console.log("Expires at: ", this.expires_at);
  }

  /**
   * @param {*} url - the url to send the request to not including the base url
   * @param {*} options - { method: "GET", headers: { }, body: { } }
   * @returns
   */
  async createSpotifyRequest(url, options) {
    await this.resetToken();
    const res = await fetch(`${this.BASE_URL}/${url}`, {
      ...options,
      headers: {
        ...(options ? options.headers : {}),
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return res;
  }

  async searchTracks(query, options) {
    return this.createSpotifyRequest(
      `search?q=${encodeURIComponent(query)}&type=track&limit=${
        options.limit || 1
      }&offset=${options.offset || 0}`,
      options
    );
  }
}

export default SpotifyClient;
