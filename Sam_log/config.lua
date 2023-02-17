Config                        		= {}
Config.Locale 				  		= 'en'
Config.green 				  		= 56108
Config.grey 				  		= 8421504
Config.red 					  		= 16711680
Config.orange 				  		= 16744192
Config.blue 				  		= 2061822
Config.purple 				  		= 11750815
-----------------------------



-----------------------------

------------------------ Weapon Systems ------------------------
Config.webhook_reweapon2car		    = ""
Config.webhook_addweapon2car		= ""
Config.webhook_reweapon2home	    = ""
Config.webhook_addweapon2home		= ""

------------------------ Cars Systems ------------------------

Config.webhook_add2caritem        	= ""
Config.webhook_re2caritem           = ""
Config.webhook_add2carmoney     	= ""
Config.webhook_re2carmoney 	        = ""

------------------------ Home Systems ------------------------

Config.webhook_putmoneyinhome		= ""
Config.webhook_outmoneyinhome		= ""
Config.webhook_putiteminhome		= ""
Config.webhook_getiteminhome		= ""

------------------------ Garage Systems ------------------------

Config.webhook_addcar_garage  		= ""
Config.webhook_delcar_garage  		= ""
Config.webhook_addcar_pound   		= ""

------------------------ Tranfer Systems ------------------------

Config.webhook_gi_money       		= ""
Config.webhook_gi_item        		= ""
Config.webhook_gi_weapon        	= ""


-------------------------   Vault ------------------------------

Config.webhook_addvault				= ""
Config.webhook_revault 				= ""

------------------------ Others Systems ------------------------

Config.webhook_chat			  		= ""
Config.webhook_buycar		  		= ""
Config.webhook_selldrugs	  		= ""
Config.webhook_transfer_money		= ""
Config.webhook_buyitem		  		= ""
Config.webhook_re_money       		= ""
Config.webhook_re_item        		= ""
Config.webhook_Pickup         		= ""
Config.webhook_kill              	= ""  
Config.webhook_crafting         	= ""
Config.webhook                		= ""
Config.webhook_player_join    		= ""









settings = {
	LogKills = true, -- Log when a player kill an other player.
	LogEnterPoliceVehicle = true, -- Log when an player enter in a police vehicle.
	LogEnterBlackListedVehicle = true, -- Log when a player enter in a blacklisted vehicle.
	LogPedJacking = true, -- Log when a player is jacking a car
	LogChatServer = true, -- Log when a player is talking in the chat , /command works too.
	LogLoginServer = true, -- Log when a player is connecting/disconnecting to the server.
	LogItemTransfer = true, -- Log when a player is giving an item.
	LogWeaponTransfer = true, -- Log when a player is giving a weapon.
	LogMoneyTransfer = true, -- Log when a player is giving money
	LogMoneyBankTransfert = true, -- Log when a player is giving money from bankaccount

}



blacklistedModels = {
	"APC",
	"BARRACKS",
	"BARRACKS2",
	"RHINO",
	"CRUSADER",
	"CARGOBOB",
	"SAVAGE",
	"TITAN",
	"LAZER",
	"LAZER",
}
