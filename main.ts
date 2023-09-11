enum RadioMessage {
    DEBUG_Spawn_2nd_Microbit = 36064,
    message1 = 49434
}
/**
 * Set DeviceID to 0
 */
/**
 * Set NextID to 1
 */
/**
 * Set Radio Group
 */
/**
 * then loop as long as device has not ben initialized with a ID
 */
/**
 * debug - radio send a trash message
 */
// IF
// DeviceID has no been set, then set DeviceID = NextID and then broadcast the increase of NextID
// ELSE
// Debug purpose Send a radio signal to all listening units except it self with a value of 0
input.onButtonPressed(Button.A, function () {
    // Everything in ELSE block is purely for debugging
    if (deviceID == -1) {
        deviceID = nextID
        nextID += 1
        radio.sendValue("NextID", nextID)
    } else {
        sendTestMSG()
    }
})
// Adds power's of 2 until we have the same char.
// Compares before adding to se if calcuated charcode is less or bigger than received char's code.
function toCharCode (char: string) {
    toCharCodecharcode = 0
    loopIndex = 15
    while (char != String.fromCharCode(toCharCodecharcode)) {
        if (char.compare(String.fromCharCode(2 ** loopIndex + toCharCodecharcode)) >= 0) {
            toCharCodecharcode += 2 ** loopIndex
        }
        loopIndex += -1
    }
    return toCharCodecharcode
}
radio.onReceivedString(function (receivedString) {
    // Takes char from position 0 if deviceID is > 16 due to 16/16 = 1 then truncated to just 1. which gives us 1-1. all other values will be 0.x where truncation only gives us 0
    extenderSignal = toCharCode(receivedString.charAt(1 - Math.trunc(deviceID / 16)))
    if (containsExtenderID(extenderSignal)) {
        extenderSignal = extenderSignal - 2 ** (deviceID % 16)
        radioMessage = receivedString.substr(2, receivedString.length - 3)
        // check if we are using the first 16 ids or the last 16 ids
        if (deviceID > 15) {
            extendSignal("" + String.fromCharCode(extenderSignal) + receivedString.charAt(1), radioMessage)
        } else {
            extendSignal("" + receivedString.charAt(0) + String.fromCharCode(extenderSignal), radioMessage)
        }
    } else {
        basic.showIcon(IconNames.No)
        basic.clearScreen()
    }
    basic.showIcon(IconNames.Heart)
})
// subtracts all power's of 2 that are greater than DeviceID then we try and divide to see if we get a result ≥ 1 which would mean that this DeviceID is allowed to repeat
function containsExtenderID (charcode: number) {
    shouldExtendcharcode = charcode
    loopIndex = 15
    while (loopIndex > deviceID % 16) {
        // Only subtract if that power exist (Ie Charcode is larger than the 2's power)
        if (2 ** loopIndex <= shouldExtendcharcode) {
            shouldExtendcharcode = shouldExtendcharcode - 2 ** loopIndex
        }
        loopIndex += -1
    }
    return shouldExtendcharcode / 2 ** (deviceID % 16) >= 1
}
// Joins Repeater ID bits and message, animates display and sends radio
function extendSignal (extensionBits: string, Extendmessage: string) {
    radioMessage = "" + extensionBits + Extendmessage
    animateExtension()
    radio.sendString(radioMessage)
}
// IF
// name == "NextID" then change our NextID to be equal to new.
// ELSE
// check if we receive a string of 1's and 0's.
// For example 1001001 = value
// One Exist in spot 7  /|\
// and if there is a 1 in the position of the device ID then we Repeat the signal but with a ID when this device id has filpped 1 to 0 and Sends the value again
// New transmission 1001000 = Value
radio.onReceivedValue(function (name, value) {
    if (name == "NextID") {
        nextID = value
    }
})
function animateExtension () {
    images.createImage(`
        . # # # .
        . # # # .
        # # # # #
        . # # # .
        . . # . .
        `).showImage(0)
    basic.clearScreen()
    images.createImage(`
        . . . . .
        . . . . .
        # . . . .
        . . . . .
        . . . . .
        `).showImage(0)
    images.createImage(`
        . . . . .
        . . . . .
        # . # . .
        . . . . .
        . . . . .
        `).showImage(0)
    images.createImage(`
        . . . . .
        . . . . .
        . . # . #
        . . . . .
        . . . . .
        `).showImage(0)
    images.createImage(`
        . . . . .
        . . . . .
        . . . . #
        . . . . .
        . . . . .
        `).showImage(0)
    basic.clearScreen()
    images.createImage(`
        . . # . .
        . # # # .
        # # # # #
        . # # # .
        . # # # .
        `).showImage(0)
    basic.clearScreen()
}
function sendTestMSG () {
    loopIndex = 0
    radioMessage = ""
    charcode = 0
    // Valid exponents range from 0-15 (16 different values 1 for each id)
    while (loopIndex < 16) {
        // index can range from 0 - 31 but by using remainder of / 16 we will then map 16-31 to 0-15
        if (loopIndex != deviceID % 16) {
            charcode = charcode + 2 ** loopIndex
        }
        loopIndex += 1
    }
    if (deviceID < 16) {
        radioMessage = "" + String.fromCharCode(2 ** 16 - 1) + String.fromCharCode(charcode) + String.fromCharCode(255) + String.fromCharCode(35) + String.fromCharCode(1023)
    } else {
        radioMessage = "" + String.fromCharCode(charcode) + String.fromCharCode(2 ** 16 - 1) + String.fromCharCode(255) + String.fromCharCode(35) + String.fromCharCode(1023)
    }
    radio.sendString(radioMessage)
}
// Animate what the next available ID is
function IdNotSet () {
    basic.showNumber(nextID + 1)
    basic.clearScreen()
    basic.pause(1000)
}
let charcode = 0
let shouldExtendcharcode = 0
let radioMessage = ""
let extenderSignal = 0
let loopIndex = 0
let toCharCodecharcode = 0
let deviceID = 0
let nextID = 0
radio.setGroup(137)
radio.sendMessage(RadioMessage.DEBUG_Spawn_2nd_Microbit)
// Valid ID's are from 0-31
nextID = 0
// -1 = no ID has been set yet
deviceID = -1
while (deviceID == -1) {
    IdNotSet()
}
basic.showIcon(IconNames.Heart)
