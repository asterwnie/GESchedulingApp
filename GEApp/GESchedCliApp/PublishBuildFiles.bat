del /Q /F ..\GESchedApiApp\index.html
del /Q /F /S ..\GESchedApiApp\client-ui\*.*
xcopy .\dist\index.html ..\GESchedApiApp
xcopy /S /Y /I .\dist\static\*.* ..\GESchedApiApp\client-ui\