function bytesToInt(by) {
  var f = by[0] | by[1] << 8 | by[2] << 16 | by[3] << 24;
  return f;
}

function bytesToFloat(by) {
  var bits = by[3] << 24 | by[2] << 16 | by[1] << 8 | by[0];
  var sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
  var e = bits >>> 23 & 0xff;
  var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
  var f = sign * m * Math.pow(2, e - 150);
  return f;
}

function decodeUplink(input) {
  var bytes = input.bytes;
  var i = 0;
  var data = {};

  if (input.fPort == 1) {
    data.event = "mailbox_opened";
  } else if (input.fPort == 2) {
    data.event = "heartbeat";
  }

  if (bytes.length == 2) {
    data.battery = bytes[i++];
    if (input.fPort == 2)
      data.firmware = bytes[i++];
  } else if (bytes.length == 1) {
    data.battery = bytes[i++];
  } else if ((input.fPort == 1 && bytes.length == 7) || (input.fPort == 2 && bytes.length == 8)) {
    data.battery = bytes[i++];
    if (input.fPort == 2)
      data.firmware = bytes[i++];
    data.switchIrqTotal = (bytes[i++] << 8) | bytes[i++];
    data.switchIrqGoneBeforeIsr = (bytes[i++] << 8) | bytes[i++];
    data.switchIrqRejected = (bytes[i++] << 8) | bytes[i++];
  }

  return { data: data };
}