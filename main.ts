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
// Char code is a number between 0 and 255 and can be represented in binary
// x7 x6 x5 x4    x3 x2 x1 x0 where x 0-7 is either 0 or 1
// Example: The number 21 we have the binary  0001 0101
// 
// Now we want to check if this binary string contains our ID which we represent by a 1 in index equal to our ID
// so a   ID of 0 wants to check if x8 is equal to 1,
// and a ID of 1 wants to check if x7 is equal to 1 and so on.
// For ID's larger than 7 we take the remainder of ID / 8 which then gives us a value between 0-7 that we can use
// 
// To check if a number contains a 1 in our index position we can start by subtracting powers of 2 that are above our id position.
// Example:
// input is 21 and our ID is 3 (21 in binary is 0001 0101)
// so we are looking if number at index 2 is 1 (starting at 0 on the left).
// First we check that if 21 ≥ than 2^7, if not then we check next index 2^6 etc.
// 
// In this example, when we reach 2^4, we can get that 21 is larger than 16 (2^4)
// If that is the case we subtract this value and get 21-16 = 5 or in binary 0000 0101
// next is 2^3 which is to big due to 5 not being < 8.
// On the next index we have 2 which is equal to idPowInChar (our id-1) and loop ends
// now we only have 1's at and or after our index position.
// By now dividing the number (5) with 2^(id-1) we get 5//4.
// Due to integer division, all decimals are ignored and there by 5//4 = 1
// 
function containsOurID (charCode: number) {
    containsOurIDcharcode = charCode
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
// Converts a character (char) to its character code (char code) (Char must exit in Extended ASCII Table)
// All characters can be represented by 8 1's and or 0's
// Letter A  has a value of 65   or in decimal 0100 0001 or  0*2^7 + 1*2^6 + 0*2^5 + 0*2^4 + 0*2^3 + 0*2^2 + 0*2^1 + 1*2^0
// Letter Ö has a value of 214 or in decimal 1101 0110 or  1*2^7 + 1*2^6 + 0*2^5 + 1*2^4 + 0*2^3 + 1*2^2 + 1*2^1 + 0*2^0
// By knowing this we can use the compare "text" to "text" block which in code actualy compares the Extended ASCII codes.
// so Compare "A" to "Ö" is actually comparing 65 to 214.
// The block then returns
// -1 if char A < char B and
// 0  if char A = char B and lastly
// 1  if char A > char B
// By using this fact we can then check if our input char is bigger than 2^y to find the first 1 in the binary representation.
// then by adding the first one we can find the next 1 by searching for if char is bigger than 2^y+2^z where z < y.
// this repeats until we get a sum of x1*2^7 + x2*2^6 + x3*2^5 + x4*2^4 + x5*2^3 + x6*2^2 + x7*2^1 + x8*2^0 where x1-8 is 0 or 1 depending on our condition above.
// 
// If code has calculated a result bellow 0 or above 255 something went wrong so we assume value of 0
function toCharCode (char: string) {
    if (char.isEmpty()) {
        return 0
    }
    toCharcodecharcode = 0
    // 255 Is the Largest char a Micro:bit can handel.
    index = 8 - 1
    while (char != String.fromCharCode(toCharcodecharcode) && index != 0) {
        if (char.compare(String.fromCharCode(2 ** index + toCharcodecharcode)) >= 0) {
            toCharcodecharcode += 2 ** index
        }
        index += -1
    }
    if (toCharcodecharcode < 0 || toCharcodecharcode > 2 ** 8 - 1) {
        return 0
    }
    return toCharcodecharcode
}
function showData (recivedText: string) {
    for (let index = 0; index <= 13 - countIDChars; index++) {
        basic.showNumber(index)
        basic.clearScreen()
        basic.pause(100)
        basic.showNumber(toCharCode(recivedText.charAt(index + countIDChars)))
        basic.clearScreen()
        basic.pause(500)
    }
}
radio.onReceivedString(function (receivedString) {
    radioReceivedextenderSignal = toCharCode(receivedString.charAt(idMsgPos))
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
    if (name == "NextID" || name == "ImNew") {
        if (value > nextID) {
            nextID = value
            radio.sendValue("NextID", nextID)
        } else if (value < nextID) {
            radio.sendValue("NextID", nextID)
        } else {
        	
        }
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
// Replaces the char at position index whit charReplacement
// This is done by first copying index amount of chars from 0 (not inclusive of index),
// Then adding charReplacement and lastly,
// copying remaining chars starting from index + 1 (skipping old char)
// 
// 
// Example:
// Replace the 3rd char in the text "Hello" with "x"
// 
// copy 2 char starting from index 0, gives us "He".
// Then add charReplacement                        "He"+"x".
// Then add final part of the string                  "Hex"+"lo"
// (index 3 to 5-(2+1)) = (from index 3 and copy 2 chars)
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
