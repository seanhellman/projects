export const todayDate = () => {
  const date = new Date();
  const dateYear = date.getFullYear().toString();
  let dateMonth = date.getMonth() + 1;
  if (dateMonth < 10) {
    dateMonth = dateMonth.toString();
    dateMonth = "0" + dateMonth;
  }
  let dateDate = date.getDate();
  if (dateDate < 10) {
    dateDate = dateDate.toString();
    dateDate = "0" + dateDate;
  }
  return dateYear + dateMonth + dateDate;
};

export const yesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const dateYear = date.getFullYear().toString();
  let dateMonth = date.getMonth() + 1;
  if (dateMonth < 10) {
    dateMonth = dateMonth.toString();
    dateMonth = "0" + dateMonth;
  }
  let dateDate = date.getDate();
  if (dateDate < 10) {
    dateDate = dateDate.toString();
    dateDate = "0" + dateDate;
  }
  return dateYear + dateMonth + dateDate;
};