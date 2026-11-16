function decodeUplink(input) {
  var bytes = input.bytes;
  var fPort = input.fPort;

  if (fPort === 1) {
    return {
      data: {
        event: "mailbox_opened",
        raw: bytes.length ? bytes[0] : null
      }
    };
  }

  // Fallback für unbekannte fPorts
  return {
    data: {
      fPort: fPort,
      bytesHex: bytes.map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("")
    }
  };
}