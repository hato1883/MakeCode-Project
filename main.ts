enum RadioMessage {
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
    if (DeviceID == 0) {
        DeviceID = NextID
        NextID += 1
        radio.sendValue("NextID", NextID)
    } else {
        loopIndex = 1
        SendID = ""
        charcode = 0
        while (loopIndex <= 16) {
            if (loopIndex != DeviceID) {
                charcode = charcode + 2 ** (loopIndex - 1)
            }
            loopIndex += 1
        }
        SendID = "" + String.fromCharCode(2 ** 16 - 1) + String.fromCharCode(charcode) + String.fromCharCode(255) + String.fromCharCode(35) + String.fromCharCode(1023)
        radio.sendString(SendID)
    }
})
function toCharCode (char: string) {
    toCharCodecharcode = 0
    loopIndex = 15
    while (char != String.fromCharCode(toCharCodecharcode)) {
        if (char.compare(String.fromCharCode(2 ** loopIndex - 1 + toCharCodecharcode)) < 0) {
            loopIndex += -1
        } else {
            toCharCodecharcode += 2 ** (loopIndex - 1)
        }
    }
    return toCharCodecharcode
}
function shouldExtend (charcode: number) {
    shouldExtendcharcode = charcode
    loopIndex = 0
    while (16 - loopIndex >= DeviceID) {
        if (2 ** (16 - loopIndex) <= shouldExtendcharcode) {
            shouldExtendcharcode = shouldExtendcharcode - 2 ** (16 - loopIndex)
        }
        loopIndex += 1
    }
    return shouldExtendcharcode / 2 ** (DeviceID - 1) >= 1
}
radio.onReceivedString(function (receivedString) {
    if (DeviceID > 16) {
        extenderSignal = toCharCode(receivedString.charAt(0))
        if (shouldExtend(extenderSignal)) {
            basic.showNumber(toCharCode(receivedString.charAt(3)))
            extenderSignal = extenderSignal - 2 ** (DeviceID - 1)
            radio.sendString("" + String.fromCharCode(extenderSignal) + receivedString.charAt(1) + receivedString.substr(2, receivedString.length - 1))
        }
    } else {
        extenderSignal = toCharCode(receivedString.charAt(1))
        if (shouldExtend(extenderSignal)) {
            animateExtension()
            extenderSignal = extenderSignal - 2 ** (DeviceID - 1)
            radio.sendString("" + receivedString.charAt(0) + String.fromCharCode(extenderSignal) + receivedString.substr(2, receivedString.length - 1))
        } else {
            basic.showIcon(IconNames.No)
            basic.clearScreen()
        }
    }
    basic.showIcon(IconNames.Heart)
})
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
        NextID = value
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
// Animate what the next available ID is
function IdNotSet () {
    basic.showNumber(NextID)
    basic.clearScreen()
    basic.pause(1000)
}
let extenderSignal = 0
let shouldExtendcharcode = 0
let toCharCodecharcode = 0
let charcode = 0
let SendID = ""
let loopIndex = 0
let DeviceID = 0
let NextID = 0
radio.setGroup(137)
radio.sendMessage(RadioMessage.message1)
NextID = 1
DeviceID = 0
while (DeviceID == 0) {
    IdNotSet()
}
basic.showIcon(IconNames.Heart)
