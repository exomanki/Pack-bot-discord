
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

		sendToDiscord_all("Drop Log 🌐 "," ข้อมูลการทิ้งเงินของผู้เล่น ", "คุณ: **" ..name .. "** ทิ้งเงิน   \nรายละเอียด \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_re_money)

		--sendToDiscord_all("ทิ้งเงิน", name .. " ทิ้งเงิน " .. itemName .. " จำนวน " .. itemCount, Config.green, Config.webhook_re_money)
	elseif type == 'item_account' then

		sendToDiscord_all("Drop Log 🌐 "," ข้อมูลการทิ้งเงินของผู้เล่น ", "คุณ: **" ..name .. "** ทิ้งเงิน   \nรายละเอียด \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re_money)

		--sendToDiscord_all("ทิ้งเงิน", name .. " ทิ้งเงิน " .. itemName .. " จำนวน " .. itemCount, Config.red, Config.webhook_re_money)
	end
end)

RegisterServerEvent("new_GTX:removeitem")
AddEventHandler("new_GTX:removeitem", function(name, itemName, itemCount, type)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_weapon' then

		sendToDiscord_all("Drop Log 🌐 "," ข้อมูลการทิ้งอาวุธของผู้เล่น ", "คุณ: **" ..name .. "** ทิ้งอาวุธ   \nรายละเอียด \nชนิดของอาวุธ: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_gi_weapon)

		--sendToDiscord_all("ทิ้งอาวุธ", name .. " ทิ้งอาวุธ " .. itemName .. " จำนวน " .. itemCount, Config.orange, Config.webhook_re_item)
	elseif type == 'item_standard' then

		sendToDiscord_all("Drop Log 🌐 "," ข้อมูลการทิ้งไอเทมของผู้เล่น ", "คุณ: **" ..name .. "** ทิ้งไอเทม   \nรายละเอียด \nชนิดของไอเท็ม: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re_item)

		--sendToDiscord_all("ทิ้งไอเทม", name .. " ทิ้งไอเทม " .. itemName .. " จำนวน " .. itemCount, Config.blue, Config.webhook_re_item)
	end
end)

RegisterServerEvent("new_GTX:Pickup")
AddEventHandler("new_GTX:Pickup", function(name, itemName, itemCount, type)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	if type == 'item_standard' then

		sendToDiscord_all("Getitem Log 🌐 "," ข้อมูลการเก็บไอเทมจากพื้นของผู้เล่น ", "คุณ: **" ..name .. "** เก็บไอเทม   \nรายละเอียด \nชนิดของไอเท็ม: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_Pickup)

		--sendToDiscord_all("เก็บไอเทมจากพื้น", name .. " เก็บไอเทม " .. itemName .. " จำนวน " .. itemCount, Config.blue, Config.webhook_Pickup)
	elseif type == 'item_money' then

		sendToDiscord_all("Getitem Log 🌐 "," ข้อมูลการเก็บเงินจากพื้นของผู้เล่น ", "คุณ: **" ..name .. "** เก็บเงิน   \nรายละเอียด \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_Pickup)

		--sendToDiscord_all("เก็บเงินจากพื้น", name .. " เก็บเงิน " .. itemName .. " จำนวน " .. itemCount, Config.green, Config.webhook_Pickup)
	elseif type == 'item_account' then

		sendToDiscord_all("Getitem Log 🌐 "," ข้อมูลการเก็บเงินจากพื้นของผู้เล่น ", "คุณ: **" ..name .. "** เก็บเงิน   \nรายละเอียด \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_Pickup)

		--sendToDiscord_all("เก็บเงินแดงจากพื้น", name .. " เก็บเงินแดง " .. itemName .. " จำนวน " .. itemCount, Config.red, Config.webhook_Pickup)
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

		sendToDiscord_all("Recar Log 🌐 "," ข้อมูลการเก็บไอเท็มเข้ารถ ", "คุณ **" ..xPlayer.name .. "** เก็บไอเท็มเข้ารถ   \nรายละเอียด \nรถทะเบียน : " .. name .. " \nไอเท็ม : " .. itemName .. " \nจำนวน : " .. itemCount .. " ชิ้น \n Steam Hex : "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_add2caritem)


	elseif type == 'item_weapon' then

		sendToDiscord_all("Recar Log 🌐 "," ข้อมูลการเก็บอาวุธเข้ารถ ", "คุณ: **" ..xPlayer.name .. "** เก็บอาวุธเข้ารถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nอาวุธ: " .. itemName .. " \nจำนวน: " .. itemCount .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_addweapon2car)


	elseif type == 'item_account' then

		sendToDiscord_all("Recar Log 🌐 "," ข้อมูลการนำเงินแดงเข้ารถ ", "คุณ: **" ..xPlayer.name .. "** นำเงินแดงเข้ารถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_add2carmoney)

	else

		sendToDiscord_all("Recar Log 🌐 "," ข้อมูลการนำเงินเขียวเข้ารถ ", "คุณ: **" ..xPlayer.name .. "** นำเงินเขียวเข้ารถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_add2carmoney)
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
		sendToDiscord_all("Addcar Log 🌐 "," ข้อมูลการนำไอเท็มออกจากรถ ", "คุณ: **" ..xPlayer.name .. "** นำไอเท็มออกจากรถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nไอเท็ม: " .. itemName .. " \nจำนวน: " .. itemCount .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_re2caritem)
	elseif type == 'item_weapon' then
		sendToDiscord_all("Addcar Log 🌐 "," ข้อมูลการนำอาวุธออกจากรถ ", "คุณ: **" ..xPlayer.name .. "** นำอาวุธออกจากรถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nอาวุธ: " .. itemName .. " \nจำนวน: " .. itemCount .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_reweapon2car)
	elseif type == 'item_account' then
		sendToDiscord_all("Addcar Log 🌐 "," ข้อมูลการนำเงินแดงออกจากรถ ", "คุณ: **" ..xPlayer.name .. "** นำเงินแดงออกจากรถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_re2carmoney)
	else
		sendToDiscord_all("Addcar Log 🌐 "," ข้อมูลการนำเงินเขียวออกจากรถ ", "คุณ: **" ..xPlayer.name .. "** นำเงินเขียวออกจากรถ   \nรายละเอียด \nรถทะเบียน: " .. name .. " \nชนิดของเงิน: " .. itemName .. " \nจำนวน: " .. itemCount .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_re2carmoney)
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

	sendToDiscord_all("Giveitem Log 🌐 "," ข้อมูลการส่งไอเท็มระหว่างผู้เล่น ", "คุณ: **" ..name .. "** ส่งไอเท็ม   \nรายละเอียด \nผู้รับไอเท็ม: " .. nametarget .. " \nไอเท็ม: " .. itemname .. " \nจำนวน: " .. amount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_item)

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

	sendToDiscord_all("Money Log 🌐 "," ข้อมูลการส่งเงินระหว่างผู้เล่น ", "คุณ: **" ..name .. "** ส่งเงิน   \nรายละเอียด \nผู้รับเงิน: " .. nametarget .. " \nจำนวน: " .. amount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_money)

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

	sendToDiscord_all("Money Log 🌐 "," ข้อมูลการโอนเงินระหว่างผู้เล่น ", "คุณ: **" ..name .. "** โอนเงิน   \nรายละเอียด \nผู้รับเงิน: " .. nametarget .. " \nจำนวน: " .. amount .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_money)


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

	sendToDiscord_all("Give Log 🌐 "," ข้อมูลการส่งอาวุธระหว่างผู้เล่น ", "คุณ: **" ..name .. "** ส่งอาวุธ    \nรายละเอียด \nผู้รับอาวุธ: " ..nametarget.. " \nชนิดอาวุธ: " ..weaponlabel .. "\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_gi_weapon)

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

	sendToDiscord_all("Buycar Log 🌐 "," ข้อมูลการซื้อรถ ", "คุณ: **" ..xPlayer.name .. "** ทำการซื้อรถ   \nรายละเอียด \nรถรุ่น: " .. name .. " \nราคา: " .. price .. " $ \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_buycar)

end)

RegisterServerEvent("discordbot:selldrugs_sv")
AddEventHandler("discordbot:selldrugs_sv", function(drugType, count)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Selldrung Log 🌐 "," ข้อมูลการขายสิ่งผิดกฎหมาย ", "คุณ: **" ..xPlayer.name .. "** ขายสิ่งผิดกฎหมาย   \nรายละเอียด \nรูปแบบไอเท็ม: " .. drugType .. " \nจำนวน: " .. count .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_selldrugs)

--		sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " ทำการขายยา " .. drugType .. " ให้กับ NPC จำนวน " .. count .. " ชิ้น", Config.orange, Config.webhook_selldrugs)
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
	sendToDiscord_all("Log Server 🌐 "," ข้อมูลการแลกเปลี่ยนเงินแดง ", "คุณ: **" ..xPlayer.name .. "** ทำการแลกเปลี่ยนเงินแดง   \nรายละเอียด: " .. redmoney .. " 🔜 " .. greenmoney .. "💵  \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_transfer_money)

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
		sendToDiscord_all("Crafting log 🌐 ","✅ ข้อมูลการคราฟไอเท็มติด ", "คุณ: **" ..xPlayer.name .. "** ตีไอเท็มติด ✅  \nชื่อไอเท็ม: " .. item .. " จำนวน ( " .. amount .. " ) \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_crafting)
	else
		sendToDiscord_all("Crafting log 🌐 ","❌ ข้อมูลการคราฟไอเท็มแตก ", "คุณ: **" ..xPlayer.name .. "** ตีไอเท็มแตก ❌  \nชื่อไอเท็ม: " .. item .. " จำนวน ( " .. amount .. " ) \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_crafting)
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

	sendToDiscord_all("Garage Log 🌐 "," ข้อมูลการเก็บรถ ", "คุณ: **" ..xPlayer.name .. "** ทำการเก็บรถ   \nรายละเอียด \nป้ายทะเบียน: " .. plate .. " \nสถานะ : เข้าการาจ \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_delcar_garage)


end)

RegisterServerEvent("discordbot:addcargarage_sv")
AddEventHandler("discordbot:addcargarage_sv", function(plate)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Garage Log 🌐 "," ข้อมูลการเรียกรถ ", "คุณ: **" ..xPlayer.name .. "** ทำการเรียกรถ   \nรายละเอียด \nป้ายทะเบียน: " .. plate .. " \nสถานะ : ออกจากการาจ \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_addcar_garage)

end)

RegisterServerEvent("discordbot:poundcargarage_sv")
AddEventHandler("discordbot:poundcargarage_sv", function(plate)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("Garage Log 🌐 "," ข้อมูลการกู้คืนรถ ", "คุณ: **" ..xPlayer.name .. "** ทำการกู้คืนรถ   \nรายละเอียด \nป้ายทะเบียน: " .. plate .. "\nสถานะ : พาวท์ \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.orange, Config.webhook_addcar_pound)

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

	  sendToDiscord_all("Chat Log 🌐 "," ข้อมูลการพิมพ์แชท ", "คุณ: **" ..player.name .. "** ทำการพิมพ์แชท  \nรายละเอียด \nชนิดแชทที่พิม: " .. message .. " \n Steam : "..player.name.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.grey, Config.webhook_chat)

  end
end)

-- Event when a player is connecting
RegisterServerEvent("esx:playerconnected")
AddEventHandler('esx:playerconnected', function()
  if(settings.LogLoginServer)then
    sendToDiscord_all(_U('server_connecting'), GetPlayerName(source) .." เข้าเกมส์ ",Config.grey, Config.webhook_player_join)
  end
end)

-- Event when a player is disconnecting
AddEventHandler('playerDropped', function(reason)
  if(settings.LogLoginServer)then
    sendToDiscord_all(_U('server_disconnecting'), GetPlayerName(source) .." ออกจากเกมส์ : ("..reason..")",Config.grey, Config.webhook_player_join)
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

	sendToDiscord_all("Buy Log 🌐 "," ข้อมูลการซื้อไอเท็ม ", "คุณ: **" ..xPlayer.name .. "** ซื้อไอเท็ม   \nชื่อไอเท็ม: " .. item .. " จำนวน ( " .. count .. " ) \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_buyitem)

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

	sendToDiscord_all("Vault Log 🌐 "," ข้อมูลการใช้ตู้ ", "คุณ: **" ..xPlayer.name .. "** นำไอเท็ม  \nรายละเอียด \nชื่อไอเท็ม: " .. type .. " \nจำนวน: " .. item .. "  \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_addvault)

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

	sendToDiscord_all("Vault Log 🌐 "," ข้อมูลการนำของออกตู้ ", "คุณ: **" ..xPlayer.name .. "** นำไอเท็ม  \nรายละเอียด \nชื่อไอเท็ม: " .. type .. " \nจำนวน: " .. item .. "  \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_revault)

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

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการเก็บไอเท็มเข้าบ้าน ", "คุณ: **" ..xPlayer.name .. "** เก็บไอเท็มเข้าบ้าน   \nรายละเอียด \nไอเท็ม: " .. item .. " \nจำนวน: " .. count .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_putiteminhome)

	--local xItem = xPlayer.getInventoryItem(itemName)
		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เก็บไอเท็ม " .. item .. " เข้าบ้าน จำนวน " .. count .. " ชิ้น", Config.blue, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:putmoneyhome_sv")
AddEventHandler("discordbot:putmoneyhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการเก็บเงินเข้าบ้าน ", "คุณ: **" ..xPlayer.name .. "** เก็บเงินเข้าบ้าน   \nรายละเอียด \nชนิดของเงิน: " .. item .. " \nจำนวน: " .. count .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_putmoneyinhome)

	--local xItem = xPlayer.getInventoryItem(itemName)

	
		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เก็บเงิน " .. item .. " เข้าบ้าน จำนวน " .. count .. "$", Config.green, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:putweaponhome_sv")
AddEventHandler("discordbot:putweaponhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการเก็บอาวุธเข้าบ้าน ", "คุณ: **" ..xPlayer.name .. "** เก็บอาวุธเข้าบ้าน   \nรายละเอียด \nอาวุธ: " .. item .. " \nจำนวนกระสุน: " .. count .. " แม็ก \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.green, Config.webhook_addweapon2home)

		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เก็บอาวุธ " .. item .. " เข้าบ้าน 1 และกระสุน จำนวน " .. count .. " แม็ก", Config.orange, Config.webhook_putiteminhome)
end)

RegisterServerEvent("discordbot:getitemhome_sv")
AddEventHandler("discordbot:getitemhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการนำไอเท็มออกจากบ้าน ", "คุณ: **" ..xPlayer.name .. "** นำไอเท็มออกจากบ้าน   \nรายละเอียด \nไอเท็ม: " .. item .. " \nจำนวน: " .. count .. " ชิ้น \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.blue, Config.webhook_getiteminhome)

		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เอาไอเท็ม " .. item .. " ออกจากบ้าน จำนวน " .. count .. " ชิ้น", Config.blue, Config.webhook_getiteminhome)
end)

RegisterServerEvent("discordbot:getmoneyhome_sv")
AddEventHandler("discordbot:getmoneyhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการนำเงินออกจากบ้าน ", "คุณ: **" ..xPlayer.name .. "** นำเงินออกจากบ้าน   \nรายละเอียด \nชนิดของเงิน: " .. item .. " \nจำนวน: " .. count .. " 💲 \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_outmoneyinhome)

		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เอาเงิน " .. item .. " ออกจากบ้าน จำนวน " .. count .. " $", Config.red, Config.webhook_getiteminhome)
end)

RegisterServerEvent("discordbot:getweaponhome_sv")
AddEventHandler("discordbot:getweaponhome_sv", function(count, item)
	local xPlayer = ESX.GetPlayerFromId(source)
	local steamhex = GetPlayerIdentifier(source)
	local date = os.date('*t')

	if date.hour < 10 then date.hour = '0' .. tostring(date.hour) end
	if date.min < 10 then date.min = '0' .. tostring(date.min) end
	if date.sec < 10 then date.sec = '0' .. tostring(date.sec) end

	sendToDiscord_all("House Log 🌐 "," ข้อมูลการนำอาวุธออกจากบ้าน ", "คุณ: **" ..xPlayer.name .. "** นำอาวุธออกจากบ้าน   \nรายละเอียด \nอาวุธ: " .. item .. " \nจำนวนกระสุน: " .. count .. " แม็ก \n Steam Hex: "..steamhex.."\n เมื่อเวลา : "..date.hour..":"..date.min..":"..date.sec.."", Config.red, Config.webhook_reweapon2home)

		--sendToDiscord_all("ผู้เล่นชื่อ ", xPlayer.name .. " เอาอาวุธ " .. item .. " ออกจากบ้าน 1 และกระสุน จำนวน " .. count .. " แม็ก", Config.orange, Config.webhook_getiteminhome)
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

            sendToDiscord("ผู้เล่นชื่อ ", xPlayer.name .." ทำการฆ่า "..xPlayerKiller.name.." ".._('with').." "..model,Config.red, Config.webhook_kill)
			
       else
            sendToDiscord("ผู้เล่นชื่อ ", xPlayer.name .." ทำการฆ่า "..xPlayerKiller.name,Config.red, Config.webhook_kill)

       end
    end
  else
     sendToDiscord(_U('server_kill'), xPlayer.name .." โดนฆ่าโดยไม่มีสาเหตุ",Config.red, Config.webhook_kill)

  end

end)