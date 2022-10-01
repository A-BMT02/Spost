export const reducer = (state, action) => {
  switch (action.type) {
    case "addContent":
      const updatedContent = addItem(action.item, action.index, state);
      return updatedContent;

    case "addPicture":
      const updatedMedia = addPicture(
        action.fileType,
        action.file,
        action.index,
        state
      );
      return updatedMedia;

    case "removeMedia":
      const removedMedia = removeMedia(action.media, action.index, state);
      return removedMedia;

    case "addEmpty":
      return { value: [...state.value, { text: "", media: [] }] };

    case "delete":
      const updatedState = deleteOne(action.index, state);
      return updatedState;

    default:
      return state;
  }
};
const addItem = (item, index, state) => {
  if (state.value.length == 0) {
    return { value: [{ text: item }] };
  } else {
    const newValue = state.value.map((obj, i) => {
      if (i === index) {
        return { ...obj, text: item };
      } else {
        return obj;
      }
    });

    return { value: newValue };
  }
};
const addPicture = (fileType, file, index, state) => {
  const newValue = state.value.map((obj, i) => {
    if (i === index) {
      const allMedia = obj.media;
      allMedia.push({ file, type: fileType });
      return { ...obj, media: allMedia };
    } else {
      return obj;
    }
  });

  return { value: newValue };
};

const removeMedia = (media, index, state) => {
  const newValue = state.value.map((obj, i) => {
    if (i === index) {
      const allMedia = obj.media;
      const newMedia = allMedia.filter((item) => {
        return item !== media;
      });
      return { ...obj, media: newMedia };
    } else {
      return obj;
    }
  });

  return { value: newValue };
};

const deleteOne = (index, state) => {
  const newValue = state.value.filter((obj, i) => {
    return i !== index;
  });
  return { value: newValue };
};
