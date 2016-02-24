  Import-Module webadministration

  $config = ([xml](Get-Content "$OctopusPackageDirectoryPath\deploy.config")).Deployment
  $basePath = $OctopusPackageDirectoryPath
  $buildQuality = "Dev"
  if ($basePath -match "-rel") #Used by teams that use Dev/Trunk branch strategy
  {	
	$buildQuality = "Rel"	
  }
  echo "Build Quality: $buildQuality"  

$targetEnvName = $OctopusEnvironmentName;
  
   foreach ($lobby in $config.Lobbies.Lobby){
    $lobbyName = "$($config.Brand).$($config.Site).$($lobby.Name)".Replace("..", ".")
	if (($BuildQuality -eq "Rel") -and ($DoNotSeparateRelIIS -ne "True")) {  
		$lobbyName = "Rel." + $lobbyName
	}
    $IISSiteRoot = "IIS:\Sites\$lobbyName"
    $PhysicalSiteRoot = ""
	

	if($lobby.LobbyPath -eq $null){
	  #$PhysicalSiteRoot = "$basePath\$($lobby.Name)"
	  $PhysicalSiteRoot = "$basePath"
    }
    else {
	  echo "PhysicalSiteRoot is overridden by LobbyPath attribute"
      #$PhysicalSiteRoot = "$basePath"
    }

    if(!(Test-Path IIS:\AppPools\$lobbyName)) {
      echo "Creating apppool $lobbyName"
      New-WebAppPool $lobbyName | out-null
      Set-ItemProperty IIS:\AppPools\$lobbyName managedRuntimeVersion v4.0
    }
    else
    {
      echo "apppool $lobbyName already exists"
    } 

	#Get-Item "$PhysicalSiteRoot\*.ps1" | remove-item

    if(Test-Path $IISSiteRoot) { # Site exists - just update the path
      echo "Updating physical path for $lobbyName to $PhysicalSiteRoot"
      Set-ItemProperty $IISSiteRoot -Name physicalPath -Value $PhysicalSiteRoot
    }
    else { # Site doesn't exist - set it up		
		# id is a workaround to avoid a "Out of bounds" bug in New-Website when the IIS has 0 websites. See http://stackoverflow.com/questions/3573889/ps-c-new-website-blah-throws-index-was-outside-the-bounds-of-the-array
		$id = (dir iis:\sites | foreach {$_.id} | sort -Descending | select -first 1) + 1
		
		if($UseHostHeaderNotPort -eq "True") # Sets up the site on port 80 but with a Host header. Used on Mobile QA
		{			
			$HostHeader = $lobby.DevHostHeader 				
			if ($BuildQuality -eq "Rel") {
				$HostHeader = $lobby.RelHostHeader			
			}
			echo "Creating site $lobbyName with physical path $PhysicalSiteRoot and host header $HostHeader"
			New-Website -Name $lobbyName -Port 80 -PhysicalPath $PhysicalSiteRoot -ApplicationPool $lobbyName -HostHeader $HostHeader -Id $id | out-null
			New-WebBinding -Name $lobbyName -Port 443 -Protocol https -HostHeader $HostHeader|Set-WebBinding -Name $lobbyName -PropertyName HostHeader -Value $HostHeader |out-null				
		}					
		else {				
			if ($lobby.OnlySsl -eq "True")  { # Creates the site with only SSL binding the port. Used for payment/CDE sites since they should have SSL between loadbalancer and webfront
				echo "Creating site $lobbyName with physical path $PhysicalSiteRoot on port $Port using SSL"
				New-Website -Name $lobbyName -Port $lobby.Port -ssl -PhysicalPath $PhysicalSiteRoot -ApplicationPool $lobbyName -Id $id| out-null
				Get-ChildItem cert:\LocalMachine\MY | Select-Object -First 1 | New-Item 0.0.0.0!$lobby.Port |out-null
			}
			else { # Creates the website on the specified port. This is the standard PROD and Load Balanced environments case.
				echo "Creating site $lobbyName with physical path $PhysicalSiteRoot on port $Port"
				New-Website -Name $lobbyName -Port $lobby.Port -PhysicalPath $PhysicalSiteRoot -ApplicationPool $lobbyName -Id $id| out-null
			}
		}			
    }


	# Setup Applications if there are any defined in the Applications section in deploy.config
	if($config.Applications -ne $null){ 
	
	    $IISApp = Get-WebApplication -Site $lobbyName -Name "Core"
	 
	 if(!(Test-Path "$basePath\CoreRoot")){
        new-item -path "$basePath\CoreRoot" -type directory
     }

    if(!$IISApp) {
      echo "Creating core application"
      New-WebApplication -Name "Core" -Site $lobbyName -PhysicalPath "$basePath\CoreRoot" -ApplicationPool $lobbyName | out-null
    }
	else{
	    echo "Updating Core Application with physical path $basePath\CoreRoot"
        Set-ItemProperty "$IISSiteRoot\Core" -Name physicalPath -Value "$basePath\CoreRoot"
	}

    foreach($Application in $config.Applications.Application) {
      $IISApp = Get-WebApplication -Site $lobbyName -Name "Core/$($Application.Name)"
      
      if($IISApp) {
        echo "Updating Application $($Application.Name) with physical path $basePath\$($Application.Name)"
        Set-ItemProperty "$IISSiteRoot\Core\$($Application.Name)" -Name physicalPath -Value "$basePath\$($Application.Name)"
      }
      else {
        echo "Creating Application $($Application.Name) with physical path $basePath\$($Application.Name)"
        New-WebApplication -Name $Application.Name -Site "$lobbyName\Core" -PhysicalPath "$basePath\$($Application.Name)" -ApplicationPool $lobbyName | out-null
      }
    }

	}


  }