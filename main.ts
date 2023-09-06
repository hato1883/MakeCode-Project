input.onButtonPressed(Button.A, function () {
    if (DeviceID == 0) {
        DeviceID = NextID
        NextID += 1
        radio.sendValue("NextID", NextID)
    }
})
radio.onReceivedValue(function (name, value) {
    if (name == "NextID") {
        NextID = value
    }
})
function IdNotSet () {
    basic.showNumber(NextID)
    basic.clearScreen()
    basic.pause(1000)
}
let DeviceID = 0
let NextID = 0
radio.setGroup(123)
NextID = 1
DeviceID = 0
basic.forever(function () {
    if (DeviceID == 0) {
        IdNotSet()
    } else {
        basic.showNumber(DeviceID)
    }
})
