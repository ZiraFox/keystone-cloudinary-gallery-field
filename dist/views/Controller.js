function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FieldController = require('@keystonejs/fields/Controller');

class CloudinaryGalleryController extends FieldController.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "serialize", data => {
      const {
        path
      } = this;

      if (!data || !data[path]) {
        // Forcibly return null if empty string
        return null;
      }

      return data[path];
    });

    _defineProperty(this, "getQueryFragment", () => `
    ${this.path} {
        images {
            caption
            image {
                id
                path
                filename
                mimetype
                encoding
                publicUrlTransformed(transformation: {
                    width: "240"
                    height: "240"
                    crop: "fill"
                    gravity: "faces:auto"
                    fetch_format: "auto"
                })
            }
        }
    }
  `);

    _defineProperty(this, "getFilterTypes", () => []);
  }

}

module.exports = CloudinaryGalleryController;