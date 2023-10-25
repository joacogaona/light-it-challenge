

export const saveDataToLocalStorage = ({key,data}:{key:string,data:unknown}) => {
    const prevData = localStorage.getItem(key);
    const newData = prevData
      ? [...JSON.parse(prevData), data]
      : [data];
    localStorage.setItem(key, JSON.stringify(newData));
  }
  