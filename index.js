function validateAndGetFormData() {
  let empId = $("#empId").val().trim();
  let empName = $("#empName").val().trim();
  let salary = $("#salary").val().trim();
  let hra = $("#hra").val().trim();
  let da = $("#da").val().trim();
  let deduction = $("#deduction").val().trim();

  if (empId === "") {
    alert("Employee ID is required!");
    $("#empId").focus();
    return "";
  }
  if (empName === "") {
    alert("Employee Name is required!");
    $("#empName").focus();
    return "";
  }
  if (salary === "") {
    alert("Basic Salary is required!");
    $("#salary").focus();
    return "";
  }
  if (hra === "") {
    alert("HRA is required!");
    $("#hra").focus();
    return "";
  }
  if (da === "") {
    alert("DA is required!");
    $("#da").focus();
    return "";
  }
  if (deduction === "") {
    alert("Deduction is required!");
    $("#deduction").focus();
    return "";
  }

  if (!/^[A-Z0-9]+$/.test(empId)) {
    alert("Employee ID must contain only uppercase letters and numbers!");
    $("#empId").focus();
    return "";
  }

  return JSON.stringify({
    EmpId: empId,
    EmpName: empName,
    Salary: salary,
    HRA: hra,
    DA: da,
    Deduction: deduction,
  });
}

function resetForm() {
  $("#empId").val("");
  $("#empName").val("");
  $("#salary").val("");
  $("#hra").val("");
  $("#da").val("");
  $("#deduction").val("");
  $("#empId").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);

  $("#empId").focus();
}

function saveData() {
  console.log("saveData");
  let jsonData = validateAndGetFormData();
  if (!jsonData) return;

  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/iml";
  const apiEndPoint2 = "/api/irl";
  $("#save").prop("disabled", true);
  disableNavigationCtr(false);
  let putRequest = createPUTRequest(connToken, jsonData, dbName, relName);
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    putRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });
  console.log("Data saved:\n" + JSON.stringify(resultObj));

  alert("Data saved successfully!");
  disableFormCtr(true);

  $("#empId").focus();
}

function checkEmpIdExists() {
  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";

  const apiEndPoint2 = "/api/irl";
  let empId = $("#empId").val().trim();
  let jsonStr = {
    EmpId: empId,
  };
  jsonStr = JSON.stringify(jsonStr);

  let GetByKeyRequest = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relName,
    jsonStr
  );
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    GetByKeyRequest,
    baseUrl,
    apiEndPoint2
  );
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 400) {
    console.log("Data not found");
    $("#save").prop("disabled", false);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", false);
    $("#empName").focus();
  } else if (resultObj.status === 200) {
    console.log("Data found");
    let data = JSON.parse(resultObj.data).record;

    localStorage.setItem("rec_no", JSON.parse(resultObj.data).rec_no);

    $("#empName").val(data.EmpName);
    $("#salary").val(data.Salary);
    $("#hra").val(data.HRA);
    $("#da").val(data.DA);
    $("#deduction").val(data.Deduction);
    $("#empId").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    disableFormCtr(true);
    $("#empName").focus();

    disableNavigationCtr(false);

    if (localStorage.getItem("rec_no") == 1) {
      $("#previous").prop("disabled", true);
      $("#first").prop("disabled", true);
    }
    if (localStorage.getItem("rec_no") == localStorage.getItem("last-rec")) {
      $("#next").prop("disabled", true);
      $("#last").prop("disabled", true);
    }
  }
}

function changeData2() {
  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/iml";

  $("#change").prop("disabled", true);
  let rec_no = localStorage.getItem("rec_no");
  let jsonData = validateAndGetFormData();
  if (!jsonData) return;

  let updateRequest = createUPDATERecordRequest(
    connToken,
    jsonData,
    dbName,
    relName,
    rec_no
  );
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });
  console.log("Data updated:\n" + JSON.stringify(resultObj));

  $("#empId").focus();
  alert("Data updated successfully!");
}
function disableCtr(boolean) {
  $("#save").prop("disabled", boolean);
  $("#change").prop("disabled", boolean);
  $("#reset").prop("disabled", boolean);
  $("#new").prop("disabled", boolean);
  $("#edit").prop("disabled", boolean);
}

function disableNavigationCtr(boolean) {
  $("#first").prop("disabled", boolean);
  $("#last").prop("disabled", boolean);
  $("#previous").prop("disabled", boolean);
  $("#next").prop("disabled", boolean);
}

function disableFormCtr(boolean) {
  $("#empName").prop("disabled", boolean);
  $("#hra").prop("disabled", boolean);
  $("#da").prop("disabled", boolean);
  $("#deduction").prop("disabled", boolean);
  $("#salary").prop("disabled", boolean);
}
function iniEmpform() {
  localStorage.removeItem("rec_no");
  localStorage.removeItem("first-rec");
  localStorage.removeItem("last-rec");
}
iniEmpform();

function firstData() {
  console.log("firstRecord");
  disableCtr(true);
  disableFormCtr(true);
  disableNavigationCtr(false);
  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";

  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/irl";

  let GetFirstRequest = createFIRST_RECORDRequest(connToken, dbName, relName);
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    GetFirstRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });
  if (resultObj.status === 200) {
    console.log("Data found");
    let data = JSON.parse(resultObj.data).record;

    localStorage.setItem("rec_no", JSON.parse(resultObj.data).rec_no);
    localStorage.setItem("first-rec", JSON.parse(resultObj.data).rec_no);

    $("#empId").val(data.EmpId);
    $("#empName").val(data.EmpName);
    $("#salary").val(data.Salary);
    $("#hra").val(data.HRA);
    $("#da").val(data.DA);
    $("#deduction").val(data.Deduction);
    disableNavigationCtr(false);
    disableFormCtr(true);

    $("#empId").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#empId").prop("disabled", true);
    $("#change").prop("disabled", false);
    $("#first").prop("disabled", true);
    $("#previous").prop("disabled", true);

    if (localStorage.getItem("rec_no") === localStorage.getItem("last-rec")) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      $("#previous").prop("disabled", false);
      console.log("on last record");
    }

    if (localStorage.getItem("last-rec") === null) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("No last record found");
    }
    if (localStorage.getItem("first-rec") === null) {
      $("#first").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("No first record found");
    }
    $("#empId").focus();
  } else {
    alert("No records found!");
  }
}
function editData() {
  console.log("editData");
  disableCtr(true);
  disableFormCtr(false);
  disableNavigationCtr(true);
  $("#empId").prop("disabled", true);
  $("#change").prop("disabled", false);

  $("#empName").focus();
}

function newform() {
  console.log("newform");
  resetForm();
  disableFormCtr(false);

  $("#save").prop("disabled", false);
  $("#reset").prop("disabled", false);
  $("#edit").prop("disabled", true);
  $("#new").prop("disabled", true);
  disableNavigationCtr(true);
}
function lastData() {
  console.log("lastRecord");
  disableCtr(true);
  disableFormCtr(true);
  disableNavigationCtr(false);

  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/irl";

  let GetLastRequest = createLAST_RECORDRequest(connToken, dbName, relName);

  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    GetLastRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 200) {
    console.log("Data found");
    let resultData = JSON.parse(resultObj.data);
    let data = resultData.record;

    localStorage.setItem("rec_no", resultData.rec_no);
    localStorage.setItem("last-rec", resultData.rec_no);

    $("#empId").val(data.EmpId);
    $("#empName").val(data.EmpName);
    $("#salary").val(data.Salary);
    $("#hra").val(data.HRA);
    $("#da").val(data.DA);
    $("#deduction").val(data.Deduction);

    disableNavigationCtr(false);
    disableFormCtr(true);

    $("#empId").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);

    if (localStorage.getItem("rec_no") === localStorage.getItem("first-rec")) {
      $("#first").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("on first record");
    }
    if (localStorage.getItem("rec_no") === localStorage.getItem("last-rec")) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      console.log("on last record");
    }

    if (localStorage.getItem("last-rec") === null) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("No last record found");
    }

    if (localStorage.getItem("first-rec") === null) {
      $("#first").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("No first record found");
    }
  } else {
    alert("No records found!");
  }
}
function nextData() {
  console.log("nextRecord");
  disableCtr(true);
  disableFormCtr(true);
  disableNavigationCtr(false);

  const connToken = "90934664|-31949205335754090|90956087";
  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/irl";
  let rec_no = localStorage.getItem("rec_no");
  let GetNextRequest = createNEXT_RECORDRequest(
    connToken,
    dbName,
    relName,
    rec_no
  );
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    GetNextRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });
  if (resultObj.status === 200) {
    console.log("Data found");
    let resultData = JSON.parse(resultObj.data);
    let data = resultData.record;

    localStorage.setItem("rec_no", resultData.rec_no);

    $("#empId").val(data.EmpId);
    $("#empName").val(data.EmpName);
    $("#salary").val(data.Salary);
    $("#hra").val(data.HRA);
    $("#da").val(data.DA);
    $("#deduction").val(data.Deduction);

    disableNavigationCtr(false);
    disableFormCtr(true);

    $("#empId").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);

    if (localStorage.getItem("rec_no") === localStorage.getItem("last-rec")) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      console.log("on last record");
    }

    if (localStorage.getItem("first-rec") === null) {
      $("#first").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("No first record found");
    }
  } else {
    alert("No records found!");
  }
}
function checkForNoOneRecord() {
  console.log("checkForNoOneRecord");

  if (localStorage.getItem("first-rec") === null) {
    disableFormCtr(true);
    disableCtr(true);
    disableNavigationCtr(true);
    $("#new").prop("disabled", false);
  }

  if (localStorage.getItem("last-rec") === localStorage.getItem("first-rec")) {
    disableCtr(true);
    disableFormCtr(true);
    disableNavigationCtr(true);
    $("new").prop("disabled", false);
    $("#edit").prop("disabled", false);
  }
  $("#last").prop("disabled", true);
  $("#next").prop("disabled", true);
  $("#edit").prop("disabled", false);
}

function previousData() {
  console.log("previousRecord");
  disableCtr(true);
  disableFormCtr(true);
  disableNavigationCtr(false);

  const connToken = "90934664|-31949205335754090|90956087";

  const dbName = "EMPLOYEE-DB";
  const relName = "EMPLOYEE-TABLE";
  const baseUrl = "http://api.login2explore.com:5577";
  const apiEndPoint = "/api/irl";
  let rec_no = localStorage.getItem("rec_no");
  let GetPreviousRequest = createPREV_RECORDRequest(
    connToken,
    dbName,
    relName,
    rec_no
  );
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(
    GetPreviousRequest,
    baseUrl,
    apiEndPoint
  );
  jQuery.ajaxSetup({ async: true });
  if (resultObj.status === 200) {
    console.log("Data found");
    let resultData = JSON.parse(resultObj.data);
    let data = resultData.record;

    localStorage.setItem("rec_no", resultData.rec_no);

    $("#empId").val(data.EmpId);
    $("#empName").val(data.EmpName);
    $("#salary").val(data.Salary);
    $("#hra").val(data.HRA);
    $("#da").val(data.DA);
    $("#deduction").val(data.Deduction);

    disableNavigationCtr(false);
    disableFormCtr(true);

    $("#empId").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);

    if (localStorage.getItem("rec_no") === localStorage.getItem("first-rec")) {
      $("#first").prop("disabled", true);
      $("#previous").prop("disabled", true);
      console.log("on first record");
    }

    if (localStorage.getItem("last-rec") === null) {
      $("#last").prop("disabled", true);
      $("#next").prop("disabled", true);
      console.log("No last record found");
    }
  } else {
    alert("No records found!");
  }
}

function changeData() {
  console.log("changeData");
  changeData2();
  disableFormCtr(true);
  checkForNoOneRecord();
  $("#new").prop("disabled", false);
  $("#edit").prop("disabled", false);
  disableNavigationCtr(false);
  if (localStorage.getItem("rec_no") == 1) {
    $("#previous").prop("disabled", true);
    $("#first").prop("disabled", true);
  }
  if (localStorage.getItem("rec_no") == localStorage.getItem("last-rec")) {
    $("#next").prop("disabled", true);
    $("#last").prop("disabled", true);
  }
}

firstData();
lastData();
checkForNoOneRecord();
