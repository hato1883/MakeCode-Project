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
function containsOurID (charcode: number) {
    containsOurIDcharcode = charcode
    index = countIDsInChar - 1
    while (index > idPosInChar) {
        if (2 ** index <= containsOurIDcharcode) {
            containsOurIDcharcode = containsOurIDcharcode - 2 ** index
        }
        index += -1
    }
    return Math.idiv(containsOurIDcharcode, 2 ** idPosInChar) == 1
}
function removeThisID (input2: number) {
    return input2 - 2 ** idPosInChar
}
// IF
// DeviceID has no been set, then set DeviceID = NextID and then broadcast the increase of NextID
// ELSE
// Debug purpose Send a radio signal to all listening units except it self with a value of 0
input.onButtonPressed(Button.A, function () {
    if (deviceID == -1) {
        deviceID = nextID
        nextID += 1
        radio.sendValue("NextID", nextID)
    } else {
        sendTestMSG()
    }
})
function showData (recivedText: string) {
    for (let index = 0; index <= 13 - countIDChars; index++) {
        basic.showNumber(index)
        basic.clearScreen()
        basic.pause(100)
        basic.showNumber(toCharcode(recivedText.charAt(index + countIDChars)))
        basic.clearScreen()
        basic.pause(500)
    }
}
function toCharcode (char: string) {
    if (char.isEmpty()) {
        return -1
    }
    toCharcodecharcode = 0
    index = 8 - 1
    while (char != String.fromCharCode(toCharcodecharcode)) {
        if (char.compare(String.fromCharCode(2 ** index + toCharcodecharcode)) >= 0) {
            toCharcodecharcode += 2 ** index
        }
        index += -1
    }
    return toCharcodecharcode
}
radio.onReceivedString(function (receivedString) {
    radioReceivedextenderSignal = toCharcode(receivedString.charAt(idMsgPos))
    if (containsOurID(radioReceivedextenderSignal)) {
        radioReceivedextenderSignal = removeThisID(radioReceivedextenderSignal)
        animateExtension()
        showData(receivedString)
        radio.sendString("" + (replaceCharAt(String.fromCharCode(radioReceivedextenderSignal), receivedString, idMsgPos)))
    } else {
        basic.showIcon(IconNames.No)
        basic.clearScreen()
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
        if (value > nextID) {
            nextID = value
            radio.sendValue("NextID", nextID)
        } else if (value < nextID) {
            radio.sendValue("NextID", nextID)
        } else {
        	
        }
    } else if (name == "ImNew" && value < nextID) {
        radio.sendValue("NextID", nextID)
    } else {
    	
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
    sendTestMSGcharcode = 0
    for (let index = 0; index <= countIDChars - 1; index++) {
        sendTestMSGmessage = "" + sendTestMSGmessage + String.fromCharCode(2 ** countIDsInChar - 1)
    }
    for (let index = 0; index <= 6; index++) {
        if (index != idPosInChar) {
            sendTestMSGcharcode = sendTestMSGcharcode + 2 ** index
        }
    }
    sendTestMSGmessage = replaceCharAt(String.fromCharCode(sendTestMSGcharcode), "" + sendTestMSGmessage + String.fromCharCode(35) + String.fromCharCode(255) + String.fromCharCode(255) + String.fromCharCode(255) + String.fromCharCode(255) + String.fromCharCode(255), idMsgPos)
    radio.sendString(sendTestMSGmessage)
}
function replaceCharAt (charReplacement: string, string: string, index: number) {
    return "" + string.substr(0, index) + "" + charReplacement + "" + string.substr(index + 1, string.length - (index + 1))
}
// Animate what the next available ID is
function IdNotSet () {
    basic.showNumber(nextID + 1)
    basic.clearScreen()
    basic.pause(1000)
}
let sendTestMSGmessage = ""
let sendTestMSGcharcode = 0
let radioReceivedextenderSignal = 0
let toCharcodecharcode = 0
let index = 0
let containsOurIDcharcode = 0
let idPosInChar = 0
let idMsgPos = 0
let countIDsInChar = 0
let countIDChars = 0
let deviceID = 0
let nextID = 0
radio.setGroup(144)
nextID = 0
deviceID = -1
radio.sendValue("ImNew", nextID)
while (deviceID == -1) {
    IdNotSet()
}
countIDChars = 8
countIDsInChar = 7
idMsgPos = Math.idiv(deviceID, countIDsInChar)
idPosInChar = deviceID % countIDsInChar
basic.showIcon(IconNames.Heart)
