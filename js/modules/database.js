(function(global){
  var config = {
    apiKey: "AIzaSyDaRFo82GmVTAygprgD1frGzcflcanFgi4",
    authDomain: "catastudio-d02bd.firebaseapp.com",
    databaseURL: "https://catastudio-d02bd.firebaseio.com",
    projectId: "catastudio-d02bd",
    storageBucket: "catastudio-d02bd.appspot.com",
    messagingSenderId: "171539071265"
  };
  firebase.initializeApp(config);

  var error = {
    set: function(){
      var label = document.querySelector('#fLogin label');
      label.classList.add('error');
      label.innerText = 'PASSWORD INVALID';
    },
    clear: function() {
      var label = document.querySelector('#fLogin label');
      label.classList.remove('error');
      label.innerText = 'PASSWORD';
    }
  }

  function _lightboxPass() {
    if (global.getCookie('a') !== '') {
        document.location = getCookie(this.getAttribute('data-validate'));
        return;
    }
    var template = `<div class="login">
                      <button class="login-close" onclick="document.body.removeChild(this.parentElement.parentElement)">&#10006</button>
                      <p>Access to this work is restricted. Please contact me if you need further information.</p>
                      <form id="fLogin" class="login-action">
                        <div class="form-row">
                          <label for="pass">PASSWORD</label>
                          <input id="pass" name="pass" type="password">
                          <input type="hidden" id="to" value="${this.getAttribute('data-validate')}" />
                        </div>
                        <input class="btn" type="submit" value="ENTER"/>
                      </form>
                    </div>`;
    var container = document.createElement('div');

    container.classList.add('login-container');
    container.innerHTML = template;
    document.body.appendChild(container);
    document.getElementById('pass').focus();

    document.getElementById('fLogin').addEventListener('submit', _validatePass);
    document.getElementById('pass').addEventListener('keyup', function() {
      error.clear();
    });
  }

  function _validatePass(e) {
    e.preventDefault();
    var ref = firebase.database().ref().once('value').then(function(snapshot){
      if (e.target.pass.value === snapshot.val()['login']) {
        global.setCookie('a', 't', 7);
        global.setCookie('mm', snapshot.val()['mm']);
        global.setCookie('ms', snapshot.val()['ms']);
        global.setCookie('uf', snapshot.val()['uf']);
        document.location = snapshot.val()[e.target.to.value];
      } else {
        error.set();
        e.target.reset();
      }
    });
  }

  var worksValidate = document.querySelectorAll('.work[data-validate]');
  Array.prototype.forEach.call(worksValidate, function(work){
    work.addEventListener('click', _lightboxPass, false);
  });

  if (global.getCookie('a') !== '') {
    var icons = document.querySelectorAll('.work .icon-login');
    Array.prototype.forEach.call(icons, function(icon){
      icon.children[0].className = "icon-unlocked";
    });
  }
})(window);