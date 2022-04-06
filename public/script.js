$("#getEmployees").click(getAllEmployees);
$("#getDepartments").click(getAllDepartments);
$("#getPositions").click(getAllPositions);
function getAllEmployees() {
  if ($("#employeeList").length) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      url: "/api/v1/employees",
      success: function (employees) {
        if ($("#employeeList").hasClass("d-none")) {
          $("#employeeList").removeClass("d-none");
          $("#departmentList").addClass("d-none");
          $("#positionList").addClass("d-none");
        }

        $("#employeeList tbody").empty();
        for (const employee in employees) {
          let tr = `<tr data-id="${employees[employee].id}">
        <td>${employees[employee].name}</td>
        <td>${employees[employee].surname}</td>
        <td>${employees[employee].age}</td>
        <td>${employees[employee].salary} ₼</td>
        <td>+(994) ${employees[employee].phone}</td>
        <td>${employees[employee].email}</td>
        <td>${employees[employee].position.name}</td>
        <td>
          <a class="editEmployee">
          <i class="fas fa-pen"></i>        
          </a>
          <a class="deleteEmployee">
          <i class="fas fa-trash"></i>        
          </a>
        </td>
    </tr>`;
          $("#employeeList tbody").append(tr);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });

    $("#employee-modal").on("show.bs.modal", function () {
      getPositions();
    });
    $("#employee-modal").on("hidden.bs.modal", function () {
      $("input[name='Name']").val("");
      $("input[name='Surname']").val("");
      $("input[name='Age']").val("");
      $("input[name='Salary']").val("");
      $("input[name='Phone']").val("");
      $("input[name='Email']").val("");
      let modaltitle = "New employee";
      $("#employee-modal .modal-title").text(modaltitle);
      $("#add-employee").text("Add employee");
      $("#employee-form").data("type", "create");
      $("#employee-form").removeData("id");
    });
    $("#add-employee").click(function () {
      $("#employee-form").submit();
    });
    //create employee
    $("#employee-form").submit(function (e) {
      e.preventDefault();
      if ($(this).data("type") === "create") {
        let data = {
          name: $("#Name").val(),
          surname: $("#Surname").val(),
          age: $("#Age").val(),
          salary: $("#Salary").val(),
          phone: $("#Phone").val(),
          email: $("#Email").val(),
          position: $("#Position").val(),
        };

        $.ajax({
          url: "/api/v1/employees",
          type: "post",
          dataType: "json",
          data: data,
          success: function (response) {
            let tr = `<tr data-id="${response.data.employee.id}">
            <td>${response.data.employee.name}</td>
            <td>${response.data.employee.surname}</td>
            <td>${response.data.employee.age}</td>
            <td>${response.data.employee.salary} ₼</td>
            <td>+(994) ${response.data.employee.phone}</td>
            <td>${response.data.employee.email}</td>
            <td>${response.data.employee.position.name}</td>
            <td>
              <a class="editEmployee">
              <i class="fas fa-pen"></i>       
              </a>
              <a class="deleteEmployee">
              <i class="fas fa-trash-alt"></i>        
              </a>
            </td>
        </tr>`;
            $("#employeeList tbody").append(tr);
            $("#employee-modal").modal("hide");
            toastr.success("Employee added !");
          },
          error: function (err) {
            let errorObject = err.responseJSON.err.errors;
            Object.keys(errorObject).forEach((key) => {
              console.log(errorObject[key].message)
              toastr["error"](errorObject[key].message, "Oops :/");
            });
          },
        });
      } else {
        $employeeid = $(this).data("id");
        let data = {
          name: $("#Name").val(),
          surname: $("#Surname").val(),
          age: $("#Age").val(),
          salary: $("#Salary").val(),
          phone: $("#Phone").val(),
          email: $("#Email").val(),
          position: $("#Position").val(),
        };

        $.ajax({
          url: "/api/v1/employees/" + $employeeid,
          type: "patch",
          dataType: "json",
          data: data,
          success: function (response) {
            // console.log(response.result);
            var tr = $("tr[data-id='" + response.result.id + "']");
            tr.find("td").eq(0).text(response.result.name);
            tr.find("td").eq(1).text(response.result.surname);
            tr.find("td").eq(2).text(response.result.age);
            tr.find("td").eq(3).text(response.result.salary+" ₼");
            tr.find("td").eq(4).text('+(994) ' +response.result.phone);
            tr.find("td").eq(5).text(response.result.email);
            tr.find("td").eq(6).text(response.result.position.name);
            toastr.success("Employee updated !");
            $("#employee-modal").modal("hide");
          },
          error: function (err) {
            console.log(err);
          },
        });
      }
    });

    $(document).on("click", ".deleteEmployee", function (e) {
      e.preventDefault();
      var $employeeid = $(this).parents("tr").data("id");
      // console.log($employeeid);
      swal({
        title: "Delete employee",
        text: "Are you sure for delete employee ?",
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Yes",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
      }).then((value) => {
        if (value) {
          $.ajax({
            url: "/api/v1/employees/" + $employeeid,
            type: "delete",
            dataType: "json",
            success: function (response) {
              $("tr[data-id='" + $employeeid + "']").remove();
              toastr.success("Employee removed !");
            },
            error: function () {
              toastr.warning("Employee not found :/");
            },
          });
        }
      });
    });

    //open update modal
    $(document).on("click", ".editEmployee", function (e) {
      e.preventDefault();
      let $employeeid = $(this).parents("tr").data("id");
      $.getJSON("/api/v1/employees/" + $employeeid, function (response) {
        $("input[name='Name']").val(response.employee.name);
        $("input[name='Surname']").val(response.employee.surname);
        $("input[name='Age']").val(response.employee.age);
        $("input[name='Salary']").val(response.employee.salary);
        $("input[name='Phone']").val(response.employee.phone);
        $("input[name='Email']").val(response.employee.email);
        $("#employee-modal .modal-title").text(
          response.employee.name + " " + response.employee.surname
        );
        $("#add-employee").text("Update");
        $("#employee-form").data("type", "update");
        $("#employee-form").data("id", $employeeid);
        $("#employee-modal").modal("show");
        setTimeout(function () {
          $("select[name='Position']").val(response.employee.position.id);
        }, 100);
      });
    });
  }
}
function getAllDepartments() {
  if ($("#departmentList").length) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      dataType: "JSON",
      url: "/api/v1/departments",
    }).then((departments) => {
      if ($("#departmentList").hasClass("d-none")) {
        $("#departmentList").removeClass("d-none");
        $("#employeeList").addClass("d-none");
        $("#positionList").addClass("d-none");
      }

      $("#departmentList tbody").empty();

      for (const department in departments) {
        let tr = `
        
              <tr data-id="${departments[department].id}">
                  <td>${departments[department].name}</td>
                  <td>${departments[department].manager}</td>
                  <td>
                  <a class="editDepartment">
                  <i class="fas fa-pen"></i> 
          </a>
          <a class="deleteDepartment">
          <i class="fas fa-trash"></i>        
          </a>
          </td>
              </tr>
          
        `;
        $("#departmentList tbody").append(tr);
      }
    });
    $("#department-modal").on("hidden.bs.modal", function () {
      $("input[name='depName']").val("");
      $("input[name='depManager']").val("");
      $("#department-modal .modal-title").text("New department");
      $("#add-department").text("Add department");
      $("#department-form").data("type", "create");
      $("#department-form").removeData("id");
    });
  }
}
function getAllPositions() {
  if ($("#positionList").length) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      dataType: "JSON",
      url: "/api/v1/positions",
    }).then((positions) => {
      if ($("#positionList").hasClass("d-none")) {
        $("#positionList").removeClass("d-none");
        $("#employeeList").addClass("d-none");
        $("#departmentList").addClass("d-none");
      }
      $("#positionList tbody").empty();
      for (const position in positions) {
        // console.log(positions[position].department.name);
        let tr = `
              <tr data-id="${positions[position].id}">
                  <td>${positions[position].name}</td>
                  <td>${positions[position].department.name}</td>
                  <td>
                    <a class="editPosition">
                    <i class="fas fa-pen"></i> 
                    </a>
                    <a class="deletePosition">
                    <i class="fas fa-trash"></i>        
                    </a>
                  </td>
              </tr>
        `;
        $("#positionList tbody").append(tr);
      }
    });
    $("#position-modal").on("show.bs.modal", function () {
      getDepartments();
    });

    $("#position-modal").on("hidden.bs.modal", function () {
      $("input[name='posName']").val("");
      $("select[name='posDepartment']").val("");
      $("#position-modal .modal-title").text("New position");
      $("#position-modal #add-position").text("Add position");
      $("#position-form").data("type", "create");
      $("#position-form").removeData("id");
    });
  }
}

function getPositions() {
  $.ajax({
    url: "/api/v1/positions",
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function (positions) {
      $("select[name='Position']").empty();
      $.each(positions, function (index, position) {
        let opt = `<option value="${position.id}">${position.name}</option>`;
        $("select[name='Position']").append(opt);
      });
    },
  });
}
function getDepartments() {
  $.ajax({
    url: "/api/v1/departments",
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function (departments) {
      $("select[name='posDepartment']").empty();
      $.each(departments, function (index, department) {
        let opt = `<option value="${department.id}">${department.name}</option>`;
        $("select[name='posDepartment']").append(opt);
      });
    },
  });
}

//Department CRUD :
//Department Create , Update :
$("#add-department").click(function () {
  $("#department-form").submit();
});
$("#department-form").submit(function (e) {
  e.preventDefault();
  if ($(this).data("type") == "create") {
    let data = {
      name: $("#depName").val(),
      manager: $("#depManager").val(),
    };
    $.ajax({
      url: "/api/v1/departments",
      type: "post",
      dataType: "json",
      data: data,
      success: function (response) {
        // console.log(response.newDepartment);

        let tr = `<tr data-id="${response.newDepartment.id}">
        <td>${response.newDepartment.name}</td>
        <td>${response.newDepartment.manager}</td>
        <td>
          <a class="editDepartment">
          <i class="fas fa-pen"></i>       
          </a>
          <a class="deleteDepartment">
          <i class="fas fa-trash-alt"></i>        
          </a>
        </td>
    </tr>`;
        $("#departmentList tbody").append(tr);
        $("#department-modal").modal("hide");
        toastr.success("Department added !");
      },
      error: function (err) {
        let errorObject = err.responseJSON.err.errors;
        Object.keys(errorObject).forEach((key) => {
          toastr["error"](errorObject[key].message, "Oops :/");
          console.log(errorObject[key].message);
        });
      },
    });
  } else {
    $departmentid = $(this).data("id");
    let data = {
      name: $("#depName").val(),
      manager: $("#depManager").val(),
    };

    $.ajax({
      url: "/api/v1/departments/" + $departmentid,
      type: "patch",
      dataType: "json",
      data: data,
      success: function (response) {
        console.log(response);
        let tr = $("tr[data-id='" + response.id + "']");
        tr.find("td").eq(0).text(response.name);
        tr.find("td").eq(1).text(response.manager);
        $("#department-modal").modal("hide");
        toastr.success("Department updated !");
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
});

//Department delete :
$(document).on("click", ".deleteDepartment", function (e) {
  e.preventDefault();
  var $departmentid = $(this).parents("tr").data("id");
  // console.log($departmentid);
  swal({
    title: "Delete department",
    text: "Are you sure for delete department ?",
    icon: "warning",
    buttons: {
      cancel: {
        text: "No",
        value: null,
        visible: true,
        className: "",
        closeModal: true,
      },
      confirm: {
        text: "Yes",
        value: true,
        visible: true,
        className: "",
        closeModal: true,
      },
    },
  }).then((value) => {
    if (value) {
      $.ajax({
        url: "/api/v1/departments/" + $departmentid,
        type: "delete",
        dataType: "json",
        success: function (response) {
          $("tr[data-id='" + $departmentid + "']").remove();
          toastr.success("Department removed !");
        },
        error: function () {
          toastr.warning("Department not found :/");
        },
      });
    }
  });
});

//Open update modal :
$(document).on("click", ".editDepartment", function (e) {
  e.preventDefault();
  let $departmentid = $(this).parents("tr").data("id");
  $.getJSON("/api/v1/departments/" + $departmentid, function (response) {
    $("input[name='depName']").val(response.department.name);
    $("input[name='depManager']").val(response.department.manager);
    $("#department-modal .modal-title").text(response.department.name);
    $("#department-modal #add-department").text("Update");
    $("#department-modal").modal("show");
    $("#department-form").data("type", "update");
    $("#department-form").data("id", $departmentid);
  });
});

//Position CRUD :
//Position Create , Update :

$("#add-position").click(function () {
  $("#position-form").submit();
});
$("#position-form").submit(function (e) {
  e.preventDefault();
  if ($(this).data("type") == "create") {
    let data = {
      name: $("#posName").val(),
      department: $("#posDepartment").val(),
    };

    $.ajax({
      url: "/api/v1/positions",
      type: "post",
      dataType: "json",
      data: data,
      success: function (response) {
        let tr = `<tr data-id="${response.result.id}">
        <td>${response.result.name}</td>
        <td>${response.result.department.name}</td>
        <td>
          <a class="editPosition">
          <i class="fas fa-pen"></i>       
          </a>
          <a class="deletePosition">
          <i class="fas fa-trash-alt"></i>        
          </a>
        </td>
    </tr>`;
        $("#positionList tbody").append(tr);
        $("#position-modal").modal("hide");
        toastr.success("Position added !");
      },
      error: function (err) {
        console.log(err);
        let errorObject = err.responseJSON.err.errors;
        
        Object.keys(errorObject).forEach((key) => {
          toastr["error"](errorObject[key].message, "Oops :/");
        });
      },
    });
  } else {
    $positionid = $(this).data("id");
    let data = {
      name: $("#posName").val(),
      department: $("#posDepartment").val(),
    };

    $.ajax({
      url: "/api/v1/positions/" + $positionid,
      type: "patch",
      dataType: "json",
      data: data,
      success: function (response) {
        console.log(response);
        let tr = $("tr[data-id='" + response.result.id + "']");
        tr.find("td").eq(0).text(response.result.name);
        tr.find("td").eq(1).text(response.result.department.name);
        $("#position-modal").modal("hide");
        toastr.success("Position updated !");
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
});
$(document).on("click", ".deletePosition", function (e) {
  e.preventDefault();
  var $positionid = $(this).parents("tr").data("id");
  // console.log($positionid);
  swal({
    title: "Delete position",
    text: "Are you sure for delete position ?",
    icon: "warning",
    buttons: {
      cancel: {
        text: "No",
        value: null,
        visible: true,
        className: "",
        closeModal: true,
      },
      confirm: {
        text: "Yes",
        value: true,
        visible: true,
        className: "",
        closeModal: true,
      },
    },
  }).then((value) => {
    if (value) {
      $.ajax({
        url: "/api/v1/positions/" + $positionid,
        type: "delete",
        dataType: "json",
        success: function (response) {
          $("tr[data-id='" + $positionid + "']").remove();
          toastr.success("Position removed !");
        },
        error: function () {
          toastr.warning("Position not found :/");
        },
      });
    }
  });
});
// Open update modal :
$(document).on("click", ".editPosition", function (e) {
  e.preventDefault();
  let $positionid = $(this).parents("tr").data("id");

  $.getJSON("/api/v1/positions/" + $positionid, function (response) {
    console.log(response.position);
    $("input[name='posName']").val(response.position.name);
    $("#position-modal .modal-title").text(response.position.department.name);
    $("#position-modal #add-employee").text("Update");
    $("#position-modal").modal("show");
    $("#position-form").data("type", "update");
    $("#position-form").data("id", $positionid);

    setTimeout(function () {
      $("select[name='posDepartment']").val(response.position.department.id);
    }, 100);
  });
});

// Sorting employees :

$("#employee-datatable .sortable").on("click", function () {
  let sortingType = $(this).data("sort");
  let sortingDirection = $(this).hasClass("asc") ? "desc" : "asc";
  setTimeout(() => {
    $(".sortable").removeClass("asc").removeClass("desc");
    $(this).addClass(sortingDirection);
  }, 200);

  console.log(sortingDirection);
  let URL = "/api/v1/employees/";
  $.ajax({
    url: `${URL}?sortBy=${sortingType}&orderBy=${sortingDirection}`,
    type: "get",
    dataType: "json",
    success: function (employees) {
      $("#employeeList tbody").empty();
      for (const employee in employees) {
        let tr = `<tr data-id="${employees[employee].id}">
        <td>${employees[employee].name}</td>
        <td>${employees[employee].surname}</td>
        <td>${employees[employee].age}</td>
        <td>${employees[employee].salary} ₼</td>
        <td>${employees[employee].phone}</td>
        <td>${employees[employee].email}</td>
        <td>${employees[employee].position.name}</td>
        <td>
          <a class="editEmployee">
          <i class="fas fa-pen"></i>        
          </a>
          <a class="deleteEmployee">
          <i class="fas fa-trash"></i>        
          </a>
        </td>
    </tr>`;
        $("#employeeList tbody").append(tr);
      }
    },
  });
});
$("#department-datatable .sortable-dep").on("click", function () {
  let sortingType = $(this).data("sort");
  let sortingDirection = $(this).hasClass("asc") ? "desc" : "asc";
  setTimeout(() => {
    $(".sortable-dep").removeClass("asc").removeClass("desc");
    $(this).addClass(sortingDirection);
  }, 200);
  let URL = "/api/v1/departments/";
  $.ajax({
    url: `${URL}?sortBy=${sortingType}&orderBy=${sortingDirection}`,
    type: "get",
    dataType: "json",
    success: function (departments) {
      $("#departmentList tbody").empty();
      for (const department in departments) {
        let tr = `<tr data-id="${departments[department].id}">
        <td>${departments[department].name}</td>
        <td>${departments[department].manager}</td>
        <td>
          <a class="editDepartment">
          <i class="fas fa-pen"></i>        
          </a>
          <a class="deleteDepartment">
          <i class="fas fa-trash"></i>        
          </a>
        </td>
    </tr>`;
        $("#departmentList tbody").append(tr);
      }
    },
  });
});
