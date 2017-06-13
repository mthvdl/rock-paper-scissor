
/**
 * Weapon class
 */
export default class Weapon {


    /** weapon's name */
    _name: string;

    /** file system name of the weapon's image */
    _image: string;

    constructor(name: string, image: string) {
        this._name = name;
        this._image = image;
    }

}