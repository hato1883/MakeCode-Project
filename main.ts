enum RadioMessage {
    message1 = 49434
}
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
        index = 1
        SendID = ""
        while (index < DeviceID) {
            SendID = "" + SendID + "1"
        }
        SendID = "" + SendID + "0"
        while (SendID.length < 7) {
            SendID = "" + SendID + "1"
        }
        radio.sendValue(SendID, 0)
    }
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
    } else if (parseFloat(name.substr(DeviceID - 1, 1)) == 1) {
        leftID = name.substr(0, DeviceID - 1)
        rightID = name.substr(DeviceID, name.length - DeviceID)
        reciverID = "" + leftID + convertToText(0) + rightID
        radio.sendValue(reciverID, value)
    } else {
    	
    }
})
// Animate what the next available ID is
function IdNotSet () {
    basic.showNumber(NextID)
    basic.clearScreen()
    basic.pause(1000)
}
// Set Radio Group
// debug - radio send a trash message
// Set NextID to 1
// Set DeviceID to 0
// then loop as long as device has not ben initialized with a ID
let reciverID = ""
let rightID = ""
let leftID = ""
let SendID = ""
let index = 0
let DeviceID = 0
let NextID = 0
radio.setGroup(137)
radio.sendMessage(RadioMessage.message1)
NextID = 1
DeviceID = 0
while (DeviceID == 0) {
    IdNotSet()
}
