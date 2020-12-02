
// jquery Script
$(document).ready(function(){
    if(localStorage.getItem("token")!=null){
        $(".logged-in").hide();
        $(".login-func").css("display","block");
    }
    $("#logoutbtn").click(function(){
        localStorage.clear();
        location.reload();
    });
    $("#myBtn").click(function(){
      $("#myModal").modal();
    });
    $("#myBtn2").click(function(){
      $("#myModal2").modal();
    });
    $("#addprod").click(function(){
        $("#addProdModalError").hide();
      $("#myModalprod").modal();
    });
    $("#signup-form").submit(function(event){
      event.preventDefault();
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
      event.preventDefault();
      console.log("form submit");
      var val=$('#login-form :input');
      var values = {};
      val.each(function() {
         values[this.type] = this.value;
     });
     logInUser(values);
   });
   $("#prod-form").submit(function(event){
    event.preventDefault();
        var val=$('#prod-form :input');
        var values = {};
        val.each(function(){
          values[this.name] = this.value;
        });
        addProducts(values);
   });
   $("#delete-btn").click(function(event){
        event.preventDefault();
   });
 getAllProducts();
 
  });

  //error messages
  const showerror= function(message){
    var errortoast=`<div class="container"><div class="alert alert-danger alert-dismissible show" role="alert" id="error" style="align-content: center">
	
	<strong>Error!</strong> ${message}
	<button type="button" class="close" data-dismiss="alert" ><span aria-hidden="true">&times;</span></button>
  </div></div>`;
  $("#error").remove();
  $("#main-content").before(errortoast);
}
const successmessage= function(message){
    var errortoast=`<div class="container"><div class="alert alert-success alert-dismissible show" role="alert" id="error" style="align-content: center">
	
	<strong>Success!</strong> ${message}
	<button type="button" class="close" data-dismiss="alert" ><span aria-hidden="true">&times;</span></button>
  </div></div>`;
  $("#error").remove();
  $("#main-content").before(errortoast);
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
          <img  src="./static/4.jpg" />
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
          <div class="card-read-more ">
              <a href="#" class="btn btn-link btn-block " id="${a._id}" style="color: #f9c200;">
                 <div class="glyphicon glyphicon-list"> Details</div>
              </a>
              `;
          if(localStorage.getItem("isadmin")!=null && localStorage.getItem("isadmin").localeCompare("true")===0){
              element+=`<a href="#" class="btn btn-link btn-block" style="color: #d9534f;">
                  <div class="glyphicon glyphicon-remove"> Delete</div>
              </a>
          </div>
          </div></div>`;

          }
          else{
              element+=`
          </div>
          </div></div>`;
          }
      $(".card-data-js").append(element);
     // $(".login-func").css("display","block");
        }
      })
      .catch(err => {
        console.log(err);
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
 const logInUser=function(values){ console.log("login function");fetch('http://localhost:3000/user/login', {
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
      console.log("successs");
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

    console.log(values.name);
 /* var formdata=new FormData();
  formdata.append('name',values.name);
  formdata.append('description',values.description);
  formdata.append('price',values.price);*/
  //formdata.append('image','values.Image');
  //console.log(formdata);
  fetch('http://localhost:3000', {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          price: values.price,
          description: values.description
        }),
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
          
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
              $("#addProdModalError").show();
            throw new Error('editing a post failed!');
          }
         // getAllProducts();
        //  $("#add-prod").click(function(){
        //   getAllProducts();
        //  });
          return res.json();
          
        })
        .then(resData => {
          console.log(resData);
            $("#addProdModalError").hide();
          $("#myModalprod").modal('hide');
          getAllProducts();

        })
        .catch(err => {
            $("#addProdModalError").show();

          //showerror(err);
        });

  }