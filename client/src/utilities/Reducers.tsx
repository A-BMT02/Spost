export const reducer = (state: any, action : any) => {
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
const addItem = (item: any ,index: any, state: any) => {
  if (state.value.length == 0) {
    return { value: [{ text: item }] };
  } else {
    const newValue = state.value.map((obj : any, i: any) => {
      if (i === index) {
        return { ...obj, text: item };
      } else {
        return obj;
      }
    });

    return { value: newValue };
  }
};
const addPicture = (fileType: any, file: any, index: any, state: any) => {
  const newValue = state.value.map((obj: any, i: any) => {
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

const removeMedia = (media: any, index: any, state: any) => {
  const newValue = state.value.map((obj: any, i: any) => {
    if (i === index) {
      const allMedia = obj.media;
      const newMedia = allMedia.filter((item: any) => {
        return item !== media;
      });
      return { ...obj, media: newMedia };
    } else {
      return obj;
    }
  });

  return { value: newValue };
};

const deleteOne = (index: any, state: any) => {
  const newValue = state.value.filter((obj: any, i: any) => {
    return i !== index;
  });
  return { value: newValue };
};
