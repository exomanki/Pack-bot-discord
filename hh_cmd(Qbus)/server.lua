
QBCore = nil
TriggerEvent('QBCore:GetObject', function(obj) QBCore = obj end)

local lastdata = nil

function DiscordRequest(method, endpoint, jsondata)
    local data = nil
    PerformHttpRequest("https://discordapp.com/api/" .. endpoint,function(errorCode, resultData, resultHeaders)
        data = {data = resultData, code = errorCode, headers = resultHeaders}
    end, method, #jsondata > 0 and json.encode(jsondata) or "", {
        ["Content-Type"] = "application/json",
        ["Authorization"] = "Bot " .. "PUT BOT TOKEN HERE"})  -------PREVENT DUMPERS TO GET UR TOKEN 
    while data == nil do Citizen.Wait(0) end
    return data
end


function string.starts(String, Start)
    return string.sub(String, 1, string.len(Start)) == Start
end

function mysplit(inputstr, sep)
    if sep == nil then sep = "%s" end
    local t = {}
    for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
        table.insert(t, str)
    end
    return t
end




function ExecuteCOMM(command, author)
    if string.starts(command, Config.Prefix) then
        -- Get Player Count
        if string.starts(command, Config.Prefix .. "pc") then
            sendToDiscord("Player Counts", "Current players in server : " ..GetNumPlayerIndices(), 16489834)
        -- Kick Someone
        elseif string.starts(command, Config.Prefix .. "kick") then
            if TheyHaveRole(author, "ANY") then                                         -----------Just Follow The Pattern You can Do this on multiple Commands
                local t = mysplit(command, " ")
                if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                    sendToDiscord("KICKED Succesfully","Succesfuly Kicked " .. GetPlayerName(t[2]), 16489834)
                    DropPlayer(t[2], "KICKED FROM DISCORD CONSOLE")
                else
                    sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
                end
            else
                sendToDiscord("Discord Command","You are not Authorized to Use this Command", 16711680)  
            end
            -- kill Someone
        elseif string.starts(command, Config.Prefix .. "kill") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                TriggerClientEvent("discordc:kill", t[2])
                sendToDiscord("Killed Succesfully","Succesfuly Killed " .. GetPlayerName(t[2]),16489834)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
           -- revive
        elseif string.starts(command, Config.Prefix .. "revive") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                TriggerClientEvent("hospital:client:Revive",t[2]) 
                sendToDiscord("Revived Succesfully","Succesfuly Revived " .. GetPlayerName(t[2]),16489834)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            --Delete Vehicle
        elseif string.starts(command,Config.Prefix .. "dv") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                TriggerClientEvent('QBCore:Command:DeleteVehicle', t[2])
                sendToDiscord("Vehicle Deleted Succesfully","of " .. GetPlayerName(t[2]),16489834)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID", 16489834)
            end
            --Fix Vehicle
        elseif string.starts(command,Config.Prefix .. "fix") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                TriggerClientEvent('fix', t[2])
                sendToDiscord("Vehicle Fixed Succesfully","of " .. GetPlayerName(t[2]),16489834)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID", 16489834)
            end
            --Spawn Car
        elseif string.starts(command,Config.Prefix .. "car") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                TriggerClientEvent('QBCore:Command:SpawnVehicle', t[2], t[3])
                sendToDiscord("Car : "..t[3].."", " Spawned Succesfully at " .. GetPlayerName(t[2]), 16489834)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID", 16489834)
            end
            -- setjob
        elseif string.starts(command, Config.Prefix .. "setjob") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    if t[3] and t[4] then
                        xPlayer.Functions.SetJob(tostring(t[3]), tonumber(t[4]))  
                        sendToDiscord("Discord BOT", "You Succesfuly Changed " ..GetPlayerName(t[2]) .. ' Job',16489834)
                    else
                        sendToDiscord("Discord BOT","Nikal Lawde",16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- getmoney
        elseif string.starts(command, Config.Prefix .. "getmoney") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    money = xPlayer.PlayerData.money["cash"]
                    if money then
                        sendToDiscord("Discord Bot","Target Currently Has : " .. money .."$ in their pocket", 16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- getbank
        elseif string.starts(command, Config.Prefix .. "getbank") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    money = xPlayer.PlayerData.money["bank"]
                    if money then
                        sendToDiscord("Discord Bot","Target Currently Has : " ..money .."$ in their bank account",16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- removeMoney 
        elseif string.starts(command, Config.Prefix .. "removemoney") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    if t[3] then
                        xPlayer.Functions.RemoveMoney('cash', tonumber(t[3])) 
                        sendToDiscord("Discord BOT","You Succesfuly removed " ..GetPlayerName(t[2]) .. ' money',16489834)
                    else
                        sendToDiscord("Discord BOT","ID OR Money Input is invalid make sure you are writing like this: \nprefix + removemoney + id + money",16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- addMoney
        elseif string.starts(command, Config.Prefix .. "addmoney") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    if t[3] then
                        xPlayer.Functions.AddMoney('cash',tonumber(t[3]))
                            sendToDiscord("Discord BOT","You Succesfuly added to " .. tonumber(t[3]) ..GetPlayerName(t[2]) .. ' money',16489834)
                        else
                            sendToDiscord("Discord BOT","ID OR Money Input is invalid make sure you are writing like this: \nprefix + addmoney + id + money",16489834)
                        end
                    end
                else
                    sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
                end
            -- add to bank account
        elseif string.starts(command, Config.Prefix .. "addbank") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    if t[3] then
                        xPlayer.Functions.AddMoney('bank',tonumber(t[3]))
                        sendToDiscord("Discord BOT","You Succesfuly added to " ..GetPlayerName(t[2]) .. ' bank money',16489834)
                    else
                        sendToDiscord("Discord BOT","ID OR Money Input is invalid make sure you are writing like this: \nprefix + addbank + id + money",16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- remove bank money
        elseif string.starts(command, Config.Prefix .. "removebank") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                if xPlayer then
                    if t[3] then
                        xPlayer.Functions.RemoveMoney('bank', tonumber(t[3])) 
                        sendToDiscord("Discord BOT","You Succesfuly removed from " ..GetPlayerName(t[2]) .. ' bank money',16489834)
                    else
                        sendToDiscord("Discord BOT","ID OR Money Input is invalid make sure you are writing like this: \nprefix + removebank + id + money",16489834)
                    end
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            -- multi
        elseif string.starts(command, Config.Prefix .. "multi") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                QBCore.Player.Logout(tonumber(t[2]))
                TriggerClientEvent('hh_select:client:chooseChar', tonumber(t[2]))
                if xPlayer then
                    sendToDiscord("Discord Bot","Character Menu Given" , 16489834)
                end
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            --Saveall
        elseif string.starts(command, Config.Prefix .. "saveall") then
            for k, v in pairs(QBCore.Functions.GetPlayers()) do
                local Player = QBCore.Functions.GetPlayer(v)
                if Player ~= nil then 
                    QBCore.Player.Save(Player.PlayerData.source)
                end
            end
            sendToDiscord("Discord Bot", "Saved All Players: "..QBCore.Functions.GetPlayers() , 16489834)
            --Notify
        elseif string.starts(command, Config.Prefix .. "dm") then
            local safecom = command
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                args = string.gsub(safecom, Config.Prefix .. "dm " ..t[2],"")
                TriggerClientEvent("announce", t[2], args)
                sendToDiscord("Sended Succesfully", "Succesfuly Sended : " .. args .. " | To " .. GetPlayerName(t[2]), 16489834)
            else
                sendToDiscord("Could Not Find", "Invalid InPut", 16489834)
            end
            -- giveitem
        elseif string.starts(command,Config.Prefix .. "giveitem") then
            local t = mysplit(command," ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                if t[3] ~= nil and t[4] ~= nil then
                    local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                    xPlayer.Functions.AddItem(t[3], t[4])  
                    sendToDiscord("Add Item Succesfully", "Succesfully added item to " .. GetPlayerName(t[2]) .."\nItem: ".. t[3] .. "\nQuantity: " .. t[4],16489834)
                end
            else
              sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
        elseif string.starts(command,Config.Prefix .. "jail") then
            local t = mysplit(command," ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                if t[3] ~= nil then
                    local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                    TriggerClientEvent("police:client:SendToJail", xPlayer.PlayerData.source, tonumber(t[3]))
                    sendToDiscord("Discord Command", "Succesfully Jailed " .. GetPlayerName(t[2]) .."\nJail TIme: " .. tonumber(t[3]),16489834)
                end
            else
              sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
        elseif string.starts(command,Config.Prefix .. "unjail") then
            local t = mysplit(command," ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                riggerClientEvent("prison:client:UnjailPerson", tonumber(t[2]))
                sendToDiscord("Discord Command", "Succesfully Unjailed " .. GetPlayerName(t[2]),16489834)
            else
              sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            --Unban
        elseif string.starts(command,Config.Prefix .. "unban") then
            local t = mysplit(command," ")
            if t[2] ~= nil then
                sendToDiscord("Unbanned Succesfully","Succesfuly Unbanned From Server BanID ="..t[2],16489834)
                QBCore.Functions.ExecuteSql(false, "DELETE FROM `bans` WHERE `banid` = '"..t[2].."'")
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            --Ban
        elseif string.starts(command, Config.Prefix .. "ban") then
            local t = mysplit(command, " ")
            local banTime = 2147483647
            local timeTable = os.date("*t", banTime)
            local reason = "No Reason Given"
            local banby = "Discord ADMIN"
            if t[3] ~= nil then reason = t[3] end
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                local banid = tostring(QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(5)):upper()
                QBCore.Functions.ExecuteSql(false, "SELECT * FROM `bans` WHERE `steam` = '"..GetPlayerIdentifiers(t[2])[1].."'", function(result)
                    if result[1] == nil then
                        sendToDiscord("Banned Succesfully","Succesfuly Banned \nSteam Name: " .. GetPlayerName(t[2]).."\nDiscord: "..'<@' .. GetPlayerIdentifiers(t[2])[3]:gsub('discord:', '') .. '>', 16489834)
                        QBCore.Functions.ExecuteSql(false, "INSERT INTO `bans` (`name`, `steam`, `license`, `discord`,`ip`, `reason`, `expire`, `bannedby`, `banid`) VALUES ('"..GetPlayerName(t[2]).."', '"..GetPlayerIdentifiers(t[2])[1].."', '"..GetPlayerIdentifiers(t[2])[2].."', '"..GetPlayerIdentifiers(t[2])[3].."', '"..GetPlayerIdentifiers(t[2])[5].."', '"..reason.."', "..banTime..", '"..banby.."', '"..banid.."')")
                        DropPlayer(t[2], "You have been banned from the server:\n"..reason.."\n\nBan expires: "..timeTable["day"].. "/" .. timeTable["month"] .. "/" .. timeTable["year"] .. " " .. timeTable["hour"].. ":" .. timeTable["min"] .. "\nBan ID: "..banid.."🔸 Join our Discord for further information")
                    else
                        sendToDiscord("Already Banned","This Guy is Already Baned \nDiscord: "..'<@' .. GetPlayerIdentifiers(t[2])[3]:gsub('discord:', '') .. '>',16489834)
                    end
                end)
            else
                sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
            --- Help Commands
        elseif string.starts(command, Config.Prefix .. "cmd") then
            sendToDiscord("Discord Bot All Commands Are:-", "```!pc:- To View Current Playing Players \n!dm [ID] [Message] :- To Give Message To Someone In Server  \n!kick [ID]:- To Kick Someone \n!revive [ID] :- To Revive Someone\n!fix [ID] :- To Fix Someone's Vehicle  \n!kill [ID] :- To Kill Someone  \n!ban [ID][reason] :- To Ban Someone  \n!unban [BanID] :- To Unban Someone\n!weather [name] :- To Change Weather\n!blackout :- To Toggle Blackout\n!dv [ID] :- To Delete Someone Car\n!car [ID] :- To Spawn Car\n!setjob [ID] :- To Set Someone Job\n!getmoney [ID] :- To check $ in their pocket \n!getbank [ID] :- To Check Bank Balance\n!removemoney [ID] :- To Remove Money \n!addmoney [ID] :- To Addmoney\n!addbank [ID] :- To Addmoney in bank \n!removebank [ID] :- To Remove Bank\n!giveitem [ID][NAME][Amount] :- To Additem\n!jail [ID][Time] :-To Jail Someone\n!unjail [ID] :- To Unjail\n!say [Message] :- For Announcement\n!multi [ID] :- To Give Character Menu\n!saveall :- To Save All Charcter In DB\n!closeserver :- To Shut Down Server\n!rvall :- Revive All\n!tpall [coords] :- Teleport Everyone to coords (x, y, z)\n!giveall [item][amouunt] :- Give Everyone Specific Item\n!info [ID]:- Get Player Info\n!checkinv [ID] - Check Player Inventory items\n!clearinv [ID] - Clear Player Inventory items\n!removeitem [ID][Item][amount] - Remove Player items\n!cloth [ID] - Give Clothing Menu\n!noclip [ID] - Give/Take Noclip\n!giveadmin [ID][God/Admin] - Give Admin Perms\n!removeadmin [ID] - Remove Admin Perms\n!start [script] - Start Script\n!stop [script] - Stop Script\n!restart [script] - Restart Script```" , 762640)    
         -- announce
        elseif string.starts(command, Config.Prefix .. "say") then
            local safecom = command
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                args = string.gsub(safecom, Config.Prefix .. "say","")
                TriggerClientEvent("announce", -1, args)
                sendToDiscord("Sended Succesfully", "Succesfuly Sended : " .. string.gsub(safecom, Config.Prefix .. "say","") .. " | To " .. GetNumPlayerIndices() ..  " Player in The Server",16489834)
            else
                sendToDiscord("Could Not Find", "Invalid InPut", 16489834)
            end
            -- weather
        elseif string.starts(command, Config.Prefix .. "weather") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                TriggerEvent('qb-weathersync:server:setWeather', t[2])
                sendToDiscord("Weather","Weather Succesfuly Changed",16489834)            
            else
                sendToDiscord("Could Not Find", "Invalid InPut", 16489834)
            end
        elseif string.starts(command, Config.Prefix .. "blackout") then
            TriggerEvent('qb-weathersync:server:toggleBlackout')
            sendToDiscord("Weather","Blackout",16489834)  
        elseif string.starts(command, Config.Prefix .. "closeserver") then
            sendToDiscord("Server", "Shut Down", 16489834)
            Wait(2500)
            os.exit()  
        elseif string.starts(command, Config.Prefix .. "tpall") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local coords = string.gsub(command, Config.Prefix .. "tpall","")
                local ped = GetPlayerPed(-1)
                SetEntityCoords(1, coords.x, coords.y, coords.z)
                sendToDiscord("Teleport", "Everyone Teleported to: "..coords, 16489834)  
            else
                sendToDiscord("Coords", "Invalid InPut (x, y, z)", 16489834)
            end  
        elseif string.starts(command, Config.Prefix .. "rvall") then
            TriggerClientEvent("hospital:client:Revive", -1) 
            sendToDiscord("Revived Succesfully","Succesfuly Revived " .. GetNumPlayerIndices(),16489834)  
        elseif string.starts(command,Config.Prefix .. "giveall") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and t[3] ~= nil then
                for k, v in pairs(QBCore.Functions.GetPlayers()) do
                    local Player = QBCore.Functions.GetPlayer(v)
                    if Player ~= nil then 
                        Player.Functions.AddItem(t[2], t[3])
                        TriggerClientEvent('chatMessage', -1, "SYSTEM", "error",  'You have been given '..t[2].. "Quantity "..t[3])
                        sendToDiscord("Add Item Succesfully", "Succesfully added item to " .. GetNumPlayerIndices().. " Players" .."\nItem: ".. t[2] .. "\nQuantity: " .. t[3],16489834)
                    end
                end
            else
              sendToDiscord("Format Error","giveall [item] [amount]",16489834)
            end
        elseif string.starts(command,Config.Prefix .. "info") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local sname = GetPlayerName(t[2])
                local steam = GetPlayerIdentifiers(t[2])[1]
                local discord = '<@' .. GetPlayerIdentifiers(t[2])[3]:gsub('discord:', '') .. '>'
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname
                local job = Player.PlayerData.job.label
                local bank = Player.PlayerData.money["bank"]
                local cash = Player.PlayerData.money["cash"]
                local citizenid = Player.PlayerData.citizenid
                sendToDiscord("Player Info", "**Player ID:** "..t[2].."\n**Citizen ID:** "..citizenid.."\n**Steam:** "..steam.."\n**Steam Name:** " ..sname.."\n**Ingame Name:** "..name.."\n**Job:** " ..job.."\n**Bank:** "..bank.."\n**Cash:** "..cash.."\n**Discord:** "..discord,16489834)
            else
              sendToDiscord("Format Error","info [id]",16489834)
            end
        elseif string.starts(command,Config.Prefix .. "checkinv") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."``` ("..GetPlayerIdentifiers(t[2])[1]..")```\n"
                local items = Player.PlayerData.items
                local ItemsJson = {}
                if items ~= nil and next(items) ~= nil then
                    for slot, item in pairs(items) do
                        if items[slot] ~= nil then
                            table.insert(ItemsJson, {
                                name = item.name,
                                amount = item.amount,
                            })
                        end
                    end
                end
                sendToDiscord("Player Inventory", "**Inventory:** "..name.."\n"..json.encode(ItemsJson),16489834)
            end
        elseif string.starts(command, Config.Prefix .. "clearinv") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."("..GetPlayerIdentifiers(t[2])[1]..")\n"
                Player.Functions.ClearInventory()
                QBCore.Functions.ExecuteSql(true, "UPDATE `players` SET `inventory` = '"..QBCore.EscapeSqli(json.encode({})).."' WHERE `citizenid` = '"..Player.PlayerData.citizenid.."'")
                sendToDiscord("Player Inventory", "Cleared Inventory: "..name, 16489834)  
            else
                sendToDiscord("Format Error", "clearinv [ID]", 16489834)
            end 
        elseif string.starts(command,Config.Prefix .. "removeitem") then
            local t = mysplit(command," ")
            if t[2] ~= nil and GetPlayerName(t[2]) ~= nil then
                if t[3] ~= nil and t[4] ~= nil then
                    local xPlayer = QBCore.Functions.GetPlayer(tonumber(t[2]))
                    --local xPlayer = QBCore.Functions.GetPlayer(t[2])
                    xPlayer.Functions.RemoveItem(t[3], t[4])  
                    sendToDiscord("Item Removed Succesfully", "Succesfully removed item from " .. GetPlayerName(t[2]) .."\nItem: ".. t[3] .. "\nQuantity: " .. t[4],16489834)
                end
            else
              sendToDiscord("Could Not Find","Could Not Find An ID. Make Sure To Input Valid ID",16489834)
            end
        elseif string.starts(command, Config.Prefix .. "cloth") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."("..GetPlayerIdentifiers(t[2])[1]..")"
                TriggerClientEvent("qb-clothing:client:openMenu", t[2])
                sendToDiscord("Character", "Clothing Menu Given to: "..name, 16489834)  
            else
                sendToDiscord("Format Error", "cloth [ID]", 16489834)
            end 
        elseif string.starts(command, Config.Prefix .. "noclip") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."("..GetPlayerIdentifiers(t[2])[1]..")"
                TriggerClientEvent('qb-admin:client:toggleNoclip', t[2])
                sendToDiscord("Admin", "Noclip Given to: "..name, 16489834)  
            else
                sendToDiscord("Format Error", "noclip [ID]", 16489834)
            end 
        elseif string.starts(command, Config.Prefix .. "giveadmin") then
            local t = mysplit(command, " ")
            if t[2] ~= nil and t[3] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."("..GetPlayerIdentifiers(t[2])[1]..")"
                QBCore.Functions.AddPermission(Player.PlayerData.source, tostring(t[3]):lower())
                sendToDiscord("Admin", "Permission Given to: "..name.."\nType: "..tostring(t[3]):lower(), 16489834)  
            else
                sendToDiscord("Format Error", "giveadmin [ID][God/Admin]", 16489834)
            end 
        elseif string.starts(command, Config.Prefix .. "removeadmin") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                local Player = QBCore.Functions.GetPlayer(tonumber(t[2]))
                local name = Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.."("..GetPlayerIdentifiers(t[2])[1]..")"
                QBCore.Functions.RemovePermission(Player.PlayerData.source)
                sendToDiscord("Admin", "Permission Removed from: "..name, 16489834)  
            else
                sendToDiscord("Format Error", "removeadmin [ID]", 16489834)
            end
        elseif string.starts(command, Config.Prefix .. "start") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                ExecuteCommand("start "..t[2])
                sendToDiscord("Admin", "Script Started: "..t[2], 16489834)  
            else
                sendToDiscord("Format Error", "start [script]", 16489834)
            end
        elseif string.starts(command, Config.Prefix .. "stop") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                ExecuteCommand("stop "..t[2])
                sendToDiscord("Admin", "Script Stopped: "..t[2], 16489834)  
            else
                sendToDiscord("Format Error", "stop [script]", 16489834)
            end
        elseif string.starts(command, Config.Prefix .. "restart") then
            local t = mysplit(command, " ")
            if t[2] ~= nil then
                ExecuteCommand("stop "..t[2])
                ExecuteCommand("start "..t[2])
                sendToDiscord("Admin", "Script Restarted: "..t[2], 16489834)  
            else
                sendToDiscord("Format Error", "restart [script]", 16489834)
            end
        else
            -- Command Not Found
            sendToDiscord("Discord Command","Command Not Found. Please Make Sure You Are Entering A Valid Command",16489834)
        end
    end
end







function TheyHaveRole(discordId, role)
	local theRole = nil
	if type(role) == "number" then
		theRole = tostring(role)
	else
		theRole = Config.Roles[role]
	end

	if discordId then
		local endpoint = ("guilds/%s/members/%s"):format(Config.GuildId, discordId)
		local member = DiscordRequest("GET", endpoint, {})
		if member.code == 200 then
			local data = json.decode(member.data)
			local roles = data.roles
			local found = true
			for i=1, #roles do
				if roles[i] == theRole then
					return true
				end
			end
			return false
		else
			print("An error occured, maybe they arent in the discord?")
			return false
		end
	else
		print("missing identifier")
		return false
	end
end


Citizen.CreateThread(function()
    PerformHttpRequest(Config.WebHook, function(err, text, headers) end, 'POST', json.encode({
        username = Config.ReplyUserName,
        content = "**hh_cmd Is Now Online**",
        avatar_url = Config.AvatarURL
    }), {['Content-Type'] = 'application/json'})
    while true do
        local chanel =
        DiscordRequest("GET", "channels/" .. Config.ChannelID, {})
        if chanel.data then
            local data = json.decode(chanel.data)
            local lst = data.last_message_id
            local lastmessage = DiscordRequest("GET", "channels/" ..Config.ChannelID .."/messages/" .. lst, {})
            if lastmessage.data then
                local lstdata = json.decode(lastmessage.data)
                if lastdata == nil then lastdata = lstdata.id end
                if lastdata ~= lstdata.id and lstdata.author.username ~= Config.ReplyUserName then
                    if Config.OnlyRoles then
                        if TheyHaveRole(lstdata.author.id, "CMDPERMS") then
                            ExecuteCOMM(lstdata.content, lstdata.author.id)
                            lastdata = lstdata.id
                        else
                            sendToDiscord("Discord Command","You are not Authorized to Access", 16711680)  
                        end
                    else
                        ExecuteCOMM(lstdata.content, lstdata.author.id)
                        lastdata = lstdata.id
                    end
                end
            end
        end
        Citizen.Wait(Config.WaitEveryTick)
    end
end)


function sendToDiscord(name, message, color)
    local connect = {
        {["color"] = color,
        ["title"] = "**" .. name .. "**",
        ["description"] = message,
        ["footer"] = {
            ["text"] = "HH Framework",
            ["icon_url"] = "https://cdn.discordapp.com/attachments/859771910833176586/861827808626868254/360_F_205354526_8Y8E2VbxvFJccm8T91qLKofTEIDbxgdv-removebg-preview.png",},
        }
    }
    PerformHttpRequest(Config.WebHook, function(err, text, headers) end, 'POST',
    json.encode({
        username = Config.ReplyUserName,
        embeds = connect,
        avatar_url = Config.AvatarURL
    }), {['Content-Type'] = 'application/json'})
end


