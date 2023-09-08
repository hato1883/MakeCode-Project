enum RadioMessage {
    message1 = 49434
}
input.onButtonPressed(Button.A, function () {
    if (DeviceID == 0) {
        DeviceID = NextID
        NextID += 1
        radio.sendValue("NextID", NextID)
    } else {
    	
    }
    radio.sendValue("1111111", 0)
})
radio.onReceivedValue(function (name, value) {
    if (name == "NextID") {
        NextID = value
    }
    if (parseFloat(name.substr(DeviceID - 1, 1)) == 1) {
        radio.sendValue("1111111", value)
        basic.showNumber(DeviceID)
        basic.pause(500)
        basic.showNumber(value)
        basic.pause(500)
        basic.clearScreen()
    }
})
function IdNotSet () {
    basic.showNumber(NextID)
    basic.clearScreen()
    basic.pause(1000)
}
let DeviceID = 0
let NextID = 0
radio.setGroup(137)
radio.sendMessage(RadioMessage.message1)
NextID = 1
DeviceID = 0
while (DeviceID == 0) {
    IdNotSet()
}
