import * as alt from "alt-client"
import * as game from "natives"
import * as NativeUI from "../include/NativeUI/NativeUi"
import AbstractSubMenu from "./AbstractSubMenu"
import VehicleSpawnerMenu from "./VehicleSpawnerMenu"
import VehicleCustomizationMenu from "./VehicleCustomizationMenu"
import AbstractMenu from "./AbstractMenu"
import Entity from "../utils/Entity"
import Vehicle from "../utils/Vehicle"
import network from "../modules/Network"
import tick from "../modules/Tick"
import Menu from "../utils/Menu"

export default class VehicleMenu extends AbstractSubMenu {
    static vehicle: alt.Vehicle
    private vehicleSpawnerMenu: VehicleSpawnerMenu
    private vehicleCustomizationMenu: VehicleCustomizationMenu
    private repairVehicleItem: NativeUI.UIMenuItem
    private enableEngineTorqueItem: NativeUI.UIMenuCheckboxItem
    private torqueMultiplierItem: NativeUI.UIMenuDynamicListItem
    private powerMultiplierItem: NativeUI.UIMenuDynamicListItem
    private invisibilityItem: NativeUI.UIMenuCheckboxItem
    private godmodeItem: NativeUI.UIMenuCheckboxItem
    private rainbowItem: NativeUI.UIMenuCheckboxItem
    private torqueMultiplier = 1
    private powerMultiplier = 5
    private colorIndex = 0
    private rainbowColors = [29, 38, 89, 139, 140, 70, 145]

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title)
        this.vehicleSpawnerMenu = new VehicleSpawnerMenu(this, "Vehicle Spawner")
        this.vehicleCustomizationMenu = new VehicleCustomizationMenu(this, "Vehicle Customization")
        this.addItem(this.repairVehicleItem = new NativeUI.UIMenuItem("Repair Vehicle"), () => Vehicle.repair(VehicleMenu.vehicle))
        this.addItem(this.enableEngineTorqueItem = new NativeUI.UIMenuCheckboxItem("Enable Torque Multiplier"), (state?: boolean) => {
            if (state) tick.register("enableEngineTorque", () => {
                if (alt.Player.local.vehicle)
                    game.setVehicleCheatPowerIncrease(alt.Player.local.vehicle.scriptID, this.torqueMultiplier)
            }, 0)
            else tick.clear("enableEngineTorque")
        })
        this.addItem(this.torqueMultiplierItem = new NativeUI.UIMenuDynamicListItem("Engine Torque Multiplier", (item: NativeUI.UIMenuDynamicListItem, value: string, direction: NativeUI.ChangeDirection) => {
            if (direction == NativeUI.ChangeDirection.Right) this.torqueMultiplier = +value + 5
            else this.torqueMultiplier = +value - 5
            return `${this.torqueMultiplier.toFixed(2)}`
        }, undefined, () => `${this.torqueMultiplier.toFixed(2)}`))
        this.addItem(this.powerMultiplierItem = new NativeUI.UIMenuDynamicListItem("Engine Power Multiplier", (item: NativeUI.UIMenuDynamicListItem, value: string, direction: NativeUI.ChangeDirection) => {
            if (direction == NativeUI.ChangeDirection.Right) this.powerMultiplier = +value + 5
            else this.powerMultiplier = +value - 5
            if (alt.Player.local.vehicle)
                game.modifyVehicleTopSpeed(alt.Player.local.vehicle.scriptID, this.powerMultiplier)
            return `${this.powerMultiplier.toFixed(2)}`
        }, undefined, () => `${this.powerMultiplier.toFixed(2)}`))
        this.addItem(this.invisibilityItem = new NativeUI.UIMenuCheckboxItem("Vehicle Invisibility"), (state?: boolean) => {
            let isPlayerVisible = game.isEntityVisible(alt.Player.local.scriptID)
            game.setEntityVisible(VehicleMenu.vehicle.scriptID, !state, false)
            game.setEntityVisible(alt.Player.local.scriptID, isPlayerVisible, false)
        })
        this.addItem(this.godmodeItem = new NativeUI.UIMenuCheckboxItem("Vehicle Godmode"), (state?: boolean) => Entity.setInvincible(VehicleMenu.vehicle, state))
        this.addItem(this.rainbowItem = new NativeUI.UIMenuCheckboxItem("Rainbow Vehicle"), (state?: boolean) => {
            if (state) tick.register("setVehicleRainbow", async () => {
                if (alt.Player.local.vehicle) {
                    if (this.colorIndex >= this.rainbowColors.length) this.colorIndex = 0
                    await network.callback("setVehicleColor", [alt.Player.local.vehicle, 0, this.rainbowColors[this.colorIndex]])
                    await network.callback("setVehicleColor", [alt.Player.local.vehicle, 1, this.rainbowColors[this.colorIndex]])
                    this.colorIndex++
                }
            }, 500)
            else tick.clear("setVehicleRainbow")
        })
        this.menuObject.MenuOpen.on(() => {
            if (!alt.Player.local.vehicle) {
                VehicleMenu.vehicle = undefined
                Menu.lockMenuItems(this.menuObject)
                Menu.unlockMenuItem(this.vehicleSpawnerMenu.menuItem)
                Menu.unlockMenuItem(this.enableEngineTorqueItem)
                Menu.unlockMenuItem(this.torqueMultiplierItem)
                Menu.unlockMenuItem(this.powerMultiplierItem)
                Menu.unlockMenuItem(this.rainbowItem)
            }
            else if (VehicleMenu.vehicle != alt.Player.local.vehicle) {
                VehicleMenu.vehicle = alt.Player.local.vehicle
                this.updateItems()
                Menu.unlockMenuItems(this.menuObject)
            }
        })
    }

    updateItems() {
        this.invisibilityItem.Checked = !game.isEntityVisible(VehicleMenu.vehicle.scriptID)
        this.godmodeItem.Checked = Entity.isInvincible(VehicleMenu.vehicle)
    }
}
