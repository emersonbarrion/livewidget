echo on

set _path=%1
set _drive=%_path:~1,2%

%_drive% & cd %_path%

call npm install -g npm@3.3.12
call npm install -g bower@1.6.5
call npm install -g grunt-cli@0.1.13
call npm install -g grunt@0.4.5

call npm install
call ruby install_gems.rb
call bower install

 