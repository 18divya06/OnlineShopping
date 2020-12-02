// jquery Script
$(document).ready(function(){
    $("#myBtn").click(function(){
      $("#myModal").modal();
    });
    $("#myBtn2").click(function(){
      $("#myModal2").modal();
    });
    $("#addprod").click(function(){
      $("#myModalprod").modal();
    });
    $("#signup-form").submit(function(event){
       var val=$('#signup-form :input');
       var values = {};
       val.each(function() {
         if(this.type=="checkbox"){
          values[this.type] = this.checked;
         }else{
          values[this.type] = this.value;}
      });
      signUpUser(values);
    });
    $("#login-form").submit(function(event){
      var val=$('#login-form :input');
      var values = {};
      val.each(function() {
         values[this.type] = this.value;
     });
     logInUser(values);
   });
   $("#prod-form").submit(function(event){
        var val=$('#prod-form :input');
        var values = {};
        val.each(function(){
          values[this.name] = this.value;
        });
        addProducts(values);
   });
 getAllProducts();
 
  });

  //error messages
  const showerror= function(message){
    var errortoast=`<div class="alert alert-danger alert-dismissible fade show" id="error">
	<button type="button" class="close" data-dismiss="alert">&times;</button>
	<strong>Error!</strong> ${message}
  </div>`;
  $("#error").remove();
  $("nav").after(errortoast);
}
const successmessage= function(message){
    var errortoast=`<div class="alert alert-success alert-dismissible fade show" id="error">
	<button type="button" class="close" data-dismiss="alert">&times;</button>
	<strong>Success!</strong> ${message}
  </div>`;
  $("#error").remove();
  $("nav").after(errortoast);
}

//Product fetch on page
const getAllProducts = function(){fetch('http://localhost:3000')
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch Product');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData.doc);
        for(a of resData.doc){
          var element= ` <div class="col-xs-12 col-sm-4">
          <div class="card">
          <a class="img-card" href="#">
          <img  src="https://1.bp.blogspot.com/-Bii3S69BdjQ/VtdOpIi4aoI/AAAAAAAABlk/F0z23Yr59f0/s640/cover.jpg" />
        </a>
          <div class="card-content">
              <h4 class="card-title text-center"">
                  <a href="#" >${a.name}
                </a>
              </h4>
              <p class="text-center">
                $${a.price}
              </p>
          </div>
          <div class="card-read-more">
              <a href="#" class="btn btn-link btn-block" id="${a._id}" style="color: #f9c200">
                  Details
              </a><hr>
              <a href="#" class="btn btn-link btn-block login-func isadmin"  style="color: #f9c200">
                  Delete
              </a>
          </div>
      </div></div>`;
      $(".card-data-js").append(element);
        }
      })
      .catch(err => {
        showerror(err);
      });
    }


    //signup 
const signUpUser=function(values){
  fetch('http://localhost:3000/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      username: values.text,
      isadmin: values.checkbox,
      email: values.email,
      password: values.password
    })
  })
    .then(res => {
      if (res.status === 422) {
        throw new Error(res.message);
      }
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Creating a user failed!');
      }
      return res.json();
    })
    .then(resData => {
        successmessage('Signup Successful!!!!');
       // data-dismiss="modal"
       $("#myModal2").modal('hide');

    })
    .catch(err => {
      showerror(err)
    });
  }

  //login
 const logInUser=function(values){ fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: values.email,
      password: values.password
    })
  })
    .then(res => {
      if (res.status === 422) {
        throw new Error(res.message);
      }
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Login Failed');
      }
      return res.json();
    })
    .then(resData => {
      localStorage.setItem('token', resData.token);
      localStorage.setItem('userId', resData.userId);
      localStorage.setItem('isadmin', resData.isadmin);
      $("#myModal").modal('hide');
      successmessage('Succesfull!!!!!');
      $(".logged-in").hide();
      $(".login-func").css("display","block");

    })
    .catch(err => {
      showerror(err);
    });
  }

  //add products 
  const addProducts=function(values){
    console.log(values);
  var formdata=new FormData();
  formdata.append('name',values.name);
  formdata.append('description',values.description);
  formdata.append('price',values.price);
  //formdata.append('image','values.Image');
  console.log(formdata);
  fetch('http://localhost:3000', {
        method: "POST",
        body: formdata,
        headers: {
          'x-access-token': localStorage.getItem("token")
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('editing a post failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(resData)
        })
        .catch(err => {
          showerror(err);
        });

  }