
ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
local communityname = "B-SHOP Discord Log"
local communtiylogo = "https://www.img.in.th/images/40fbe531c1c30b90963cbd95650c4e62.png" --Must end with .png or .jpg

--Send the message to your discord server
function sendToDiscord (name,message,color)
  local DiscordWebHook = Config.webhook
  -- Modify here your discordWebHook username = name, content = message,embeds = embeds

local embeds = {
    {
        ["title"]=message,
        ["type"]="rich",
        ["color"] =color,
        ["footer"]=  {
            --["text"]= "ESX-discord_bot_alert",
       },
    }
}

  if message == nil or message == '' then return FALSE end
  PerformHttpRequest(DiscordWebHook, function(err, text, headers) end, 'POST', json.encode({ username = name,embeds = embeds}), { ['Content-Type'] = 'application/json' })
end

function sendToDiscord_all (name,message,description,color,DiscordWebHook)
  --local DiscordWebHook = Config.webhook
  -- Modify here your discordWebHook username = name, content = message,embeds = embeds

local embeds = {
    {
        ["title"]=message,
        ["type"]="rich",
		["color"] =color,
		["description"] = description,
		["footer"] = {
			["text"] = communityname,
			["icon_url"] = communtiylogo,
       },
    }
}

  if message == nil or message == "Player Log #1" then return FALSE end
  PerformHttpRequest(DiscordWebHook, function(err, text, headers) end, 'POST', json.encode({ username = name,embeds = embeds}), { ['Content-Type'] = 'application/json' })
end

-- Send the first notification
sendToDiscord(_U('server'),_U('server_start'),Config.green)

RegisterServerEvent("new_GTX:removemoney")
AddEventHandler("new_GTX:removemoney", function(name, itemName, itemCount, type)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_money' then

		sendToDiscord_all("Drop Log ???? "," ????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_re_money)

		--sendToDiscord_all("????????????????????????", name .. " ???????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.green, Config.webhook_re_money)
	elseif type == 'item_account' then

		sendToDiscord_all("Drop Log ???? "," ????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re_money)

		--sendToDiscord_all("????????????????????????", name .. " ???????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.red, Config.webhook_re_money)
	end
end)

RegisterServerEvent("new_GTX:removeitem")
AddEventHandler("new_GTX:removeitem", function(name, itemName, itemCount, type)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_weapon' then

		sendToDiscord_all("Drop Log ???? "," ???????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ???????????????????????????   \n?????????????????????????????? \n????????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_gi_weapon)

		--sendToDiscord_all("???????????????????????????", name .. " ??????????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.orange, Config.webhook_re_item)
	elseif type == 'item_standard' then

		sendToDiscord_all("Drop Log ???? "," ???????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ???????????????????????????   \n?????????????????????????????? \n???????????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re_item)

		--sendToDiscord_all("???????????????????????????", name .. " ??????????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.blue, Config.webhook_re_item)
	end
end)

RegisterServerEvent("new_GTX:Pickup")
AddEventHandler("new_GTX:Pickup", function(name, itemName, itemCount, type)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_standard' then

		sendToDiscord_all("Getitem Log ???? "," ????????????????????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ???????????????????????????   \n?????????????????????????????? \n???????????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_Pickup)

		--sendToDiscord_all("????????????????????????????????????????????????", name .. " ??????????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.blue, Config.webhook_Pickup)
	elseif type == 'item_money' then

		sendToDiscord_all("Getitem Log ???? "," ?????????????????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_Pickup)

		--sendToDiscord_all("?????????????????????????????????????????????", name .. " ???????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.green, Config.webhook_Pickup)
	elseif type == 'item_account' then

		sendToDiscord_all("Getitem Log ???? "," ?????????????????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_Pickup)

		--sendToDiscord_all("??????????????????????????????????????????????????????", name .. " ????????????????????????????????? " .. itemName .. " ??????????????? " .. itemCount, Config.red, Config.webhook_Pickup)
	end
end)

RegisterServerEvent("discordbot:add2cars_sv")
AddEventHandler("discordbot:add2cars_sv", function(name, itemName, itemCount, type)
	--print('Show Discord')
	local xPlayer = ESX.GetPlayerFromId(source)
	local xItem = xPlayer.getInventoryItem(itemName)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_standard' then

		sendToDiscord_all("Recar Log ???? "," ??????????????????????????????????????????????????????????????????????????? ", "????????? **" ..xPlayer.name .. "** ????????????????????????????????????????????????   \n?????????????????????????????? \n??????????????????????????? : " .. name .. " \n?????????????????? : " .. itemName .. " \n??????????????? : " .. itemCount .. " ???????????? \n Steam Hex : "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_add2caritem)


	elseif type == 'item_weapon' then

		sendToDiscord_all("Recar Log ???? "," ???????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n???????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_addweapon2car)


	elseif type == 'item_account' then

		sendToDiscord_all("Recar Log ???? "," ???????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_add2carmoney)

	else

		sendToDiscord_all("Recar Log ???? "," ?????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ???????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_add2carmoney)
	end
end)

RegisterServerEvent("discordbot:re2cars_sv")
AddEventHandler("discordbot:re2cars_sv", function(name, itemName, itemCount, type)
	local xPlayer = ESX.GetPlayerFromId(source)
	local xItem = xPlayer.getInventoryItem(itemName)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end
	
	if type == 'item_standard' then
		sendToDiscord_all("Addcar Log ???? "," ??????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n??????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_re2caritem)
	elseif type == 'item_weapon' then
		sendToDiscord_all("Addcar Log ???? "," ???????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n???????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_reweapon2car)
	elseif type == 'item_account' then
		sendToDiscord_all("Addcar Log ???? "," ?????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ???????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re2carmoney)
	else
		sendToDiscord_all("Addcar Log ???? "," ???????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????????????????: " .. name .. " \n?????????????????????????????????: " .. itemName .. " \n???????????????: " .. itemCount .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_re2carmoney)
	end
end)

-- Add event when a player give an item
--  TriggerEvent("esx:giveitemalert",sourceXPlayer.name,targetXPlayer.name,ESX.Items[itemName].label,itemCount) -> ESX_extended
RegisterServerEvent("esx:giveitemalert")
AddEventHandler("esx:giveitemalert", function(name,nametarget,itemname,amount)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

   if(settings.LogItemTransfer)then

	sendToDiscord_all("Giveitem Log ???? "," ???????????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ???????????????????????????   \n?????????????????????????????? \n????????????????????????????????????: " .. nametarget .. " \n??????????????????: " .. itemname .. " \n???????????????: " .. amount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_item)

    --sendToDiscord_all(_U('server_item_transfer'), name.._('user_gives_to')..nametarget.." "..amount .." "..itemname, Config.orange, Config.webhook_gi_item)
   end
end)

-- Add event when a player give money
-- TriggerEvent("esx:givemoneyalert",sourceXPlayer.name,targetXPlayer.name,itemCount) -> ESX_extended
RegisterServerEvent("esx:givemoneyalert")
AddEventHandler("esx:givemoneyalert", function(name,nametarget,amount)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

  if(settings.LogMoneyTransfer)then

	sendToDiscord_all("Money Log ???? "," ?????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ?????????????????????   \n?????????????????????????????? \n??????????????????????????????: " .. nametarget .. " \n???????????????: " .. amount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_money)

    --sendToDiscord_all(_U('server_money_transfer'), name.." ".._('user_gives_to').." "..nametarget.." "..amount .." dollars", Config.orange, Config.webhook_gi_money)
  end

end)

-- Add event when a player give money
-- TriggerEvent("esx:givemoneyalert",sourceXPlayer.name,targetXPlayer.name,itemCount) -> ESX_extended
RegisterServerEvent("esx:givemoneybankalert")
AddEventHandler("esx:givemoneybankalert", function(name,nametarget,amount)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

  if(settings.LogMoneyBankTransfert)then

	sendToDiscord_all("Money Log ???? "," ?????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ?????????????????????   \n?????????????????????????????? \n??????????????????????????????: " .. nametarget .. " \n???????????????: " .. amount .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_money)


   --sendToDiscord_all(_U('server_moneybank_transfer'), name.." ".. _('user_gives_to') .." "..nametarget.." "..amount .." dollars", Config.orange, Config.webhook_gi_money)
  end

end)


-- Add event when a player give weapon
--  TriggerEvent("esx:giveweaponalert",sourceXPlayer.name,targetXPlayer.name,weaponLabel) -> ESX_extended
RegisterServerEvent("esx:giveweaponalert")
AddEventHandler("esx:giveweaponalert", function(name,nametarget,weaponlabel)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

  if(settings.LogWeaponTransfer)then

	sendToDiscord_all("Give Log ???? "," ????????????????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..name .. "** ????????????????????????    \n?????????????????????????????? \n?????????????????????????????????: " ..nametarget.. " \n???????????????????????????: " ..weaponlabel .. "\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_weapon)

    --sendToDiscord_all(_U('server_weapon_transfer'), name.." ".._('user_gives_to').." "..nametarget.." "..weaponlabel, Config.orange, Config.webhook_gi_item)
  end

end)

RegisterServerEvent("discordbot:buycar_sv")
AddEventHandler("discordbot:buycar_sv", function(name, price, player)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Buycar Log ???? "," ????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????   \n?????????????????????????????? \n??????????????????: " .. name .. " \n????????????: " .. price .. " $ \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_buycar)

end)

RegisterServerEvent("discordbot:selldrugs_sv")
AddEventHandler("discordbot:selldrugs_sv", function(drugType, count)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Selldrung Log ???? "," ??????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????????????????????   \n?????????????????????????????? \n????????????????????????????????????: " .. drugType .. " \n???????????????: " .. count .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_selldrugs)

--		sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ?????????????????????????????? " .. drugType .. " ?????????????????? NPC ??????????????? " .. count .. " ????????????", Config.orange, Config.webhook_selldrugs)
end)

RegisterServerEvent("discordbot:transfermoney_sv")
AddEventHandler("discordbot:transfermoney_sv", function(redmoney, greenmoney)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	--local xItem = xPlayer.getInventoryItem(itemName)
	sendToDiscord_all("Log Server ???? "," ?????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ??????????????????????????????????????????????????????????????????   \n??????????????????????????????: " .. redmoney .. " ???? " .. greenmoney .. "????  \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_transfer_money)

end)

RegisterServerEvent("discordbot:crafting_sv")
AddEventHandler("discordbot:crafting_sv", function(item, amount, type)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	--local xItem = xPlayer.getInventoryItem(itemName)
	if type then
		sendToDiscord_all("Crafting log ???? ","??? ?????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????? ???  \n??????????????????????????????: " .. item .. " ??????????????? ( " .. amount .. " ) \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_crafting)
	else
		sendToDiscord_all("Crafting log ???? ","??? ?????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????? ???  \n??????????????????????????????: " .. item .. " ??????????????? ( " .. amount .. " ) \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_crafting)
	end
end)

----------------------------------------------      Yoz Add ons     ------------------------------------------------


RegisterServerEvent("discordbot:delcargarage_sv")
AddEventHandler("discordbot:delcargarage_sv", function(plate)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Garage Log ???? "," ????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ?????????????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. plate .. " \n??????????????? : ??????????????????????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_delcar_garage)


end)

RegisterServerEvent("discordbot:addcargarage_sv")
AddEventHandler("discordbot:addcargarage_sv", function(plate)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Garage Log ???? "," ???????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. plate .. " \n??????????????? : ????????????????????????????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_addcar_garage)

end)

RegisterServerEvent("discordbot:poundcargarage_sv")
AddEventHandler("discordbot:poundcargarage_sv", function(plate)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Garage Log ???? "," ??????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ???????????????????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. plate .. "\n??????????????? : ??????????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_addcar_pound)

end)

-- Event when a player is writing
AddEventHandler('chatMessage', function(author, color, message)
  	if(settings.LogChatServer)then
	  local player = ESX.GetPlayerFromId(author)
	  local date = os.date('*t')

	  if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	  if date.min < 10 then date.min = '0' .. tostring(date.min) end
	  if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end
	  --local steamhex = ESX.GetPlayerIdentifier(source)

	  sendToDiscord_all("Chat Log ???? "," ??????????????????????????????????????????????????? ", "?????????: **" ..player.name .. "** ???????????????????????????????????????  \n?????????????????????????????? \n???????????????????????????????????????: " .. message .. " \n Steam : "..player.name.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.grey, Config.webhook_chat)

  end
end)

-- Event when a player is connecting
RegisterServerEvent("esx:playerconnected")
AddEventHandler('esx:playerconnected', function()
  if(settings.LogLoginServer)then
    sendToDiscord_all(_U('server_connecting'), GetPlayerName(source) .." ??????????????????????????? ",Config.grey, Config.webhook_player_join)
  end
end)

-- Event when a player is disconnecting
AddEventHandler('playerDropped', function(reason)
  if(settings.LogLoginServer)then
    sendToDiscord_all(_U('server_disconnecting'), GetPlayerName(source) .." ????????????????????????????????? : ("..reason..")",Config.grey, Config.webhook_player_join)
  end
end)
  

-- Shops --


RegisterServerEvent("discordbot:buyitem_sv")
AddEventHandler("discordbot:buyitem_sv", function(item, count)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end
	--local xItem = xPlayer.getInventoryItem(itemName)

	sendToDiscord_all("Buy Log ???? "," ????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ??????????????????????????????   \n??????????????????????????????: " .. item .. " ??????????????? ( " .. count .. " ) \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_buyitem)

end)

-- vault --

RegisterServerEvent("discordbot:addvault_sv")
AddEventHandler("discordbot:addvault_sv", function(name, item, count, type)
	--print('Show Discord')
	local xPlayer = ESX.GetPlayerFromId(source)
	local xItem = xPlayer.getInventoryItem(item)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Vault Log ???? "," ????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????  \n?????????????????????????????? \n??????????????????????????????: " .. type .. " \n???????????????: " .. item .. "  \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_addvault)

end)

RegisterServerEvent("discordbot:revault_sv")
AddEventHandler("discordbot:revault_sv", function(name, item, count, type)
	--print('Show Discord')
	local xPlayer = ESX.GetPlayerFromId(source)
	local xItem = xPlayer.getInventoryItem(item)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Vault Log ???? "," ???????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????  \n?????????????????????????????? \n??????????????????????????????: " .. type .. " \n???????????????: " .. item .. "  \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_revault)

end)

-- Homes --


RegisterServerEvent("discordbot:putitemhome_sv")
AddEventHandler("discordbot:putitemhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ??????????????????????????????????????????????????????   \n?????????????????????????????? \n??????????????????: " .. item .. " \n???????????????: " .. count .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_putiteminhome)

	--local xItem = xPlayer.getInventoryItem(itemName)
		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ?????????????????????????????? " .. item .. " ???????????????????????? ??????????????? " .. count .. " ????????????", Config.blue, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:putmoneyhome_sv")
AddEventHandler("discordbot:putmoneyhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ??????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. item .. " \n???????????????: " .. count .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_putmoneyinhome)

	--local xItem = xPlayer.getInventoryItem(itemName)

	
		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ???????????????????????? " .. item .. " ???????????????????????? ??????????????? " .. count .. "$", Config.green, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:putweaponhome_sv")
AddEventHandler("discordbot:putweaponhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ?????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ???????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????: " .. item .. " \n?????????????????????????????????: " .. count .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_addweapon2home)

		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ??????????????????????????? " .. item .. " ???????????????????????? 1 ??????????????????????????? ??????????????? " .. count .. " ????????????", Config.orange, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:getitemhome_sv")
AddEventHandler("discordbot:getitemhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ????????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ??????????????????????????????????????????????????????   \n?????????????????????????????? \n??????????????????: " .. item .. " \n???????????????: " .. count .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_getiteminhome)

		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ??????????????????????????? " .. item .. " ?????????????????????????????? ??????????????? " .. count .. " ????????????", Config.blue, Config.webhook_getiteminhome)
end)

RegisterServerEvent("discordbot:getmoneyhome_sv")
AddEventHandler("discordbot:getmoneyhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ??????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ????????????????????????????????????????????????   \n?????????????????????????????? \n?????????????????????????????????: " .. item .. " \n???????????????: " .. count .. " ???? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_outmoneyinhome)

		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ????????????????????? " .. item .. " ?????????????????????????????? ??????????????? " .. count .. " $", Config.red, Config.webhook_getiteminhome)
end)

RegisterServerEvent("discordbot:getweaponhome_sv")
AddEventHandler("discordbot:getweaponhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log ???? "," ?????????????????????????????????????????????????????????????????????????????? ", "?????????: **" ..xPlayer.name .. "** ???????????????????????????????????????????????????   \n?????????????????????????????? \n???????????????: " .. item .. " \n?????????????????????????????????: " .. count .. " ???????????? \n Steam Hex: "..steamhex.."\n ??????????????????????????? : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_reweapon2home)

		--sendToDiscord_all("????????????????????????????????? ", xPlayer.name .. " ???????????????????????? " .. item .. " ?????????????????????????????? 1 ??????????????????????????? ??????????????? " .. count .. " ????????????", Config.orange, Config.webhook_getiteminhome)
end)






-- Event when a player is killing an other one

RegisterServerEvent('esx:killerlog')
AddEventHandler('esx:killerlog', function(t,killer, kilerT) -- t : 0 = NPC, 1 = player
  local xPlayer = ESX.GetPlayerFromId(source)
  if(t == 1) then
     local xPlayer = ESX.GetPlayerFromId(source)
     local xPlayerKiller = ESX.GetPlayerFromId(killer)

     if(xPlayerKiller.name ~= nil and xPlayer.name ~= nil)then

       if(kilerT.killerinveh) then
         local model = kilerT.killervehname

            sendToDiscord("????????????????????????????????? ", xPlayer.name .." ???????????????????????? "..xPlayerKiller.name.." ".._('with').." "..model,Config.red, Config.webhook_kill)
			
       else
            sendToDiscord("????????????????????????????????? ", xPlayer.name .." ???????????????????????? "..xPlayerKiller.name,Config.red, Config.webhook_kill)

       end
    end
  else
     sendToDiscord(_U('server_kill'), xPlayer.name .." ????????????????????????????????????????????????????????????",Config.red, Config.webhook_kill)

  end

end)