function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { FieldContainer, FieldLabel, FieldInput } from '@arch-ui/fields';
import { borderRadius, gridSize, colors } from '@arch-ui/theme';
import uniqueString from 'unique-string';
import arrayMove from 'array-move';
import FieldGallery from './FieldGallery';
import FieldEditor from './FieldEditor'; // Error messages taken from CloudinaryField

const errorMessages = {
  invalid: 'Only image files are allowed. Please try again.',
  save: 'Something went wrong, please reload and try again.',
  preview: 'Something went wrong, please try again.'
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'create':
      {
        // There's already an empty one to edit
        const existing = state.images.find(x => !x.image);
        if (existing) return { ...state,
          currentlyEditing: existing.id
        }; // Insert a new empty entry to edit

        const newId = uniqueString();
        return { ...state,
          images: [...state.images, {
            id: newId,
            image: null,
            caption: ''
          }],
          currentlyEditing: newId
        };
      }

    case 'edit':
      {
        return { ...state,
          currentlyEditing: action.payload
        };
      }

    case 'update-image':
      {
        return { ...state,
          error: null,
          images: state.images.map(item => {
            const {
              id,
              ...payloadProps
            } = action.payload;
            return item.id === id ? { ...item,
              ...payloadProps
            } : item;
          })
        };
      }

    case 'move-image':
      {
        return { ...state,
          images: arrayMove(state.images, action.payload.from, action.payload.to)
        };
      }

    case 'update-caption':
      {
        return { ...state,
          images: state.images.map(image => image.id !== state.currentlyEditing ? image : { ...image,
            caption: action.payload
          })
        };
      }

    case 'editor-cancel':
      {
        return { ...state,
          currentlyEditing: null
        };
      }

    case 'remove-image':
      {
        return { ...state,
          images: state.images.filter(x => x.id !== action.payload),
          currentlyEditing: null
        };
      }

    case 'error':
      {
        return { ...state,
          error: action.payload
        };
      }

    default:
      {
        throw new Error(`Unhandled event: "${action.type}"`);
      }
  }
};

const getDataURI = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onerror = err => reject(err);

  reader.onloadend = upload => resolve(upload.target.result);
});

const getImageSrc = image => {
  var _image$publicUrlTrans;

  return (_image$publicUrlTrans = image === null || image === void 0 ? void 0 : image.publicUrlTransformed) !== null && _image$publicUrlTrans !== void 0 ? _image$publicUrlTrans : image;
};

const CloudinaryGalleryField = ({
  field,
  value,
  onChange,
  autoFocus,
  errors
}) => {
  var _map, _value$images;

  const [state, dispatch] = React.useReducer(reducer, {
    error: null,
    currentlyEditing: null,
    images: (_map = ((_value$images = value === null || value === void 0 ? void 0 : value.images) !== null && _value$images !== void 0 ? _value$images : []).map(item => ({ ...item,
      id: uniqueString()
    }))) !== null && _map !== void 0 ? _map : []
  });
  const currentlyEditing = state.currentlyEditing ? state.images.find(x => x.id === state.currentlyEditing) : null;
  const memoizedImages = React.useMemo(() => state.images.filter(x => x.image).map(x => ({
    caption: x.caption,
    image: x.upload || x.image
  })), [state.images]);
  React.useEffect(() => {
    onChange({
      images: memoizedImages
    });
  }, [onChange, memoizedImages]);
  const htmlID = `ks-cloudinary-gallery-${field.path}`;

  const handleUpload = async ({
    target: {
      validity,
      files: [file]
    }
  }) => {
    // bail if the user cancels from the file browser
    if (!file) return; // basic validity check

    if (!validity.valid) {
      dispatch({
        type: 'error',
        payload: errorMessages.save
      });
      return;
    } // check if the file is actually an image


    if (!file.type.includes('image')) {
      dispatch({
        type: 'error',
        payload: errorMessages.invalid
      });
      return;
    }

    dispatch({
      type: 'update-image',
      payload: {
        id: state.currentlyEditing,
        image: await getDataURI(file),
        upload: file
      }
    });
  };

  return jsx(React.Fragment, null, jsx(FieldContainer, null, jsx(FieldLabel, {
    htmlFor: htmlID,
    field: field,
    errors: errors
  }), jsx("div", {
    css: {
      borderRadius,
      border: `1px solid ${colors.N20}`,
      padding: gridSize * 1.5,
      overflow: 'hidden'
    }
  }, jsx(FieldInput, null, jsx(FieldGallery, {
    images: state.images.map(x => ({
      id: x.id,
      src: getImageSrc(x.image),
      caption: x.caption,
      isEditing: x.id === (currentlyEditing === null || currentlyEditing === void 0 ? void 0 : currentlyEditing.id)
    })),
    onCreate: () => dispatch({
      type: 'create'
    }),
    onEdit: id => dispatch({
      type: 'edit',
      payload: id
    }),
    onMove: (from, to) => dispatch({
      type: 'move-image',
      payload: {
        from,
        to
      }
    })
  })), currentlyEditing && jsx("div", {
    css: {
      borderTop: `1px solid ${colors.N15}`,
      background: colors.N05,
      padding: `${gridSize * 3}px ${gridSize * 2.5}px`,
      margin: `${gridSize * 1.5}px ${gridSize * -1.5}px ${gridSize * -1.5}px`
    }
  }, jsx(FieldInput, null, jsx(FieldEditor, _extends({}, currentlyEditing, {
    image: currentlyEditing.image ? getImageSrc(currentlyEditing.image) : null,
    caption: currentlyEditing.caption,
    showRemove: !!currentlyEditing.image,
    error: state.error,
    onUpload: handleUpload,
    onChangeCaption: caption => dispatch({
      type: 'update-caption',
      payload: caption
    }),
    onRemove: () => dispatch({
      type: 'remove-image',
      payload: currentlyEditing.id
    }),
    onClose: () => dispatch({
      type: 'editor-cancel'
    })
  })))))));
};

export default CloudinaryGalleryField;