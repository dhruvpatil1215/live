export default async function handler(req, res) {
  const { id } = req.query;

  // Optional: restrict user agents (uncomment if needed)
  /*
  const userAgent = req.headers["user-agent"] || "";
  const allowedAgents = ["VLC", "IPTV", "OTT", "Mozilla"];
  if (!allowedAgents.some(agent => userAgent.includes(agent))) {
    return res.status(403).send("Forbidden: Invalid User-Agent");
  }
  */

  let channelId = id;
  let urlExtension = "";

  if (!id.endsWith(".m3u8")) {
    urlExtension = ".m3u8";
  }

  const targetUrl = `http://filex.tv:8080/joeline612/FdVyzGCD7y/${channelId}${urlExtension}`;

  try {
    let response = await fetch(targetUrl);
    if (!response.ok && urlExtension === ".m3u8") {
      // Try without .m3u8 if first fails
      response = await fetch(`http://filex.tv:8080/joeline612/FdVyzGCD7y/${channelId}`);
      if (!response.ok) {
        return res.status(502).send("Bad Gateway: Stream not found");
      }
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
