import * as NativeUI from "../include/NativeUI/NativeUi"
import AbstractSubMenu from "./AbstractSubMenu"
import AbstractMenu from "./AbstractMenu"
import VehicleWheelType from "../enums/VehicleWheelType"
import VehicleMenu from "./VehicleMenu"
import Vehicle from "../utils/Vehicle"

export default class VehicleWheelsMenu extends AbstractSubMenu {
    stockWheels: NativeUI.UIMenuItem
    private wheelsMenus: WheelsMenu[]

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title)
        this.addItem(this.stockWheels = new NativeUI.UIMenuItem("Stock Wheels"), () => Vehicle.setWheels(VehicleMenu.vehicle, 0, 0))
        this.wheelsMenus = [
            new WheelsMenu(this, "Sport", VehicleWheelType.Sport, 50),
            new WheelsMenu(this, "Muscle", VehicleWheelType.Muscle, 36),
            new WheelsMenu(this, "Lowrider", VehicleWheelType.Lowrider, 30),
            new WheelsMenu(this, "SUV", VehicleWheelType.SUV, 38),
            new WheelsMenu(this, "Off-Road", VehicleWheelType.OffRoad, 35),
            new WheelsMenu(this, "Tuner", VehicleWheelType.Tuner, 48),
            new WheelsMenu(this, "Bike", VehicleWheelType.Bike, 72),
            new WheelsMenu(this, "High End", VehicleWheelType.HighEnd, 40),
            new WheelsMenu(this, "Benny's Original", VehicleWheelType.BennysOriginal, 217),
            new WheelsMenu(this, "Benny's Bespoke", VehicleWheelType.BennysBespoke, 217),
            new WheelsMenu(this, "Race", VehicleWheelType.Race, 140),
            new WheelsMenu(this, "Street", VehicleWheelType.Street, 210)
        ]
    }
}

class WheelsMenu extends AbstractSubMenu {
    constructor(parentMenu: AbstractMenu, title: string, type: VehicleWheelType, num: number) {
        super(parentMenu, title)
        for (let _i = 0; _i < num; _i++) {
            let item = new NativeUI.UIMenuItem(_i.toString())
            this.addItem(item, () => Vehicle.setWheels(VehicleMenu.vehicle, type, _i))
        }
    }
}
