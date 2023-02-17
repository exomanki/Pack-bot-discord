Config = {}
Config.WebHook = "https://discord.com/api/webhooks/861821575065894923/hzyQm5q6gKo5N40EvTzYX5fMRMIvI0hXSlo55NzwLUOLoWphg116p-BDCKYc8r-Nncyv"
Config.ChannelID = "861821519436316672"
Config.ReplyUserName = "HH FW Console Panel"
Config.AvatarURL = "https://cdn.discordapp.com/attachments/857642293485371402/865566520997314590/jkl.png"
Config.Prefix = "!"
Config.WaitEveryTick = 50  -- ITS MS


Config.OnlyRoles = true                -----All Commands Restricted to CMDPERMS Only in Channel Check Config.Roles

Config.Roles = {  ---[PUT ANYTHING JUST TO IDENTIFY] = "ROLE ID"
    ["CMDPERMS"] = "859771876947132426",
    ["ANY"] = "859784390870958111",  ---This is For Some commands accessible to this role you can add multiple if u want
    --You Can Add Multiple Roles
}

Config.GuildId = "857627233635270657"


--------------Add this to server.cfg--------------

--add_ace resource.hh_cmd command.stop allow
--add_ace resource.hh_cmd command.start allow