const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')
var JsonDB = require('node-json-db');
var db = new JsonDB("horigame/db.json", true, true);
var uconf = new JsonDB("horigame/usersettings.json", true, true);
let lstmsg
const talkedRecently = new Set();
const xpCooldown = new Set();
const translate = require('@vitalets/google-translate-api');
let editmsg


module.exports = class Horigame extends Command {

    static match(message) {
        if (config.enableHorigame) {
            if (message.guild) {
            if (message.content.startsWith("hg ")) {
                if (talkedRecently.has(message.author.id)) {
                    lstmsg = message
                    blockMessage();
                } else {
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                talkedRecently.delete(message.author.id);
                }, 5000);
            if (message.content == 'hg init') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initUser();
                };
                if (data) {
                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: **" + message.author.username + "**'s profile already exists. Use `hg reset` to reset it") } else { message.channel.send(":no_entry: Le profil utilisateur de **" + message.author.username + "** existe déjà. Utilisez `hg reset` pour le réinitialiser") }
            }}else{
                if (message.content == 'hg stats') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var level = db.getData("/game/" + message.author.id + "/level")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                    var totalXp = xp + ( level * 500 )
                    var admin = false;
                    try {
                        admin = db.getData("/game/" + message.author.id + "/admin");
                    } catch(error) {};
                    if (admin === true) { if (speakEnglish(message.author)) { var adminMsg = "\n\n:watch: **__Out__, you're an Horigame administrator!**" } else { var adminMsg = "\n\n:watch: **__Attention__, vous êtes un administrateur de Horigame !**" } } else { var adminMsg = "" }
                    if (speakEnglish(message.author)) { message.channel.send(":open_hands: **Hi " + message.author.username + ", here are your statictics:**"  + adminMsg +"\n\n:arrow_upper_right: **Level**: " + level + "\n:level_slider: **XP points for current level**: " + xp + "/500\n:up: **Total XP points**: " + totalXp + "\n:large_blue_diamond: **Diamonds in inventory**: " + diamonds + "\n:large_orange_diamond: **Gold nuggets in inventory**: " + golds + "\n:flag_white: **Iron ingots in inventory**: " + irons + "\n:pick:  **Wooden planks in inventory**: " + woods + "\n:milk: **Awaiting *XP* packages**: " + xpBottle + "\n:package: **Awaiting *wooden planks* packages**: " + woodPack + "\n:package: **Awaiting *iron ingots* packages**: " + ironPack + "\n:package: **Awaiting *gold nuggets* packages**: " + goldPack) } else { message.channel.send(":open_hands: **Bonjour " + message.author.username + ", voici vos statistiques :**"  + adminMsg +"\n\n:arrow_upper_right: **Niveau** : " + level + "\n:level_slider: **Points d'expérience pour ce niveau** : " + xp + "/500\n:up: **Total des points d'expérience** : " + totalXp + "\n:large_blue_diamond: **Diamants dans l'inventaire** : " + diamonds + "\n:large_orange_diamond: **Pépites d'or dans l'inventaire** : " + golds + "\n:flag_white: **Lingots de fer dans l'inventaire** : " + irons + "\n:pick:  **Planches de bois dans l'inventaire** : " + woods + "\n:milk: **Fioles d'expérience dans l'inventaire Bonus** : " + xpBottle + "\n:package: **Packs de *bois* dans l'inventaire Bonus** : " + woodPack + "\n:package: **Packs de *fer* dans l'inventaire Bonus** : " + ironPack + "\n:package: **Packs d'*or* dans l'inventaire Bonus** : " + goldPack) }
                }}else{
                    if (message.content == 'hg reset') {
                        try {
                            var data = db.getData("/game/" + message.author.id);
                        } catch(error) {
                            lstmsg = message
                            initErr();
                        };
                        if (speakEnglish(message.author)) { message.channel.send(":warning: You are going to reset **" + message.author.username + "**'s user profile. This cannot __cannot be undone__. **__BE SURE OF WHAT YOU'RE DOING !!!__**. Pour continuer tout de même, envoyez `hg reset --yes-i-know-what-im-doing`") } else { message.channel.send(":warning: Vous vous apprêtez à réinitialiser le profil utilisateur de **" + message.author.username + "**. Cette action est __irréversible__. **__SOYEZ BIEN SUR DE CE QUE VOUS FAITES !!!__**. Pour continuer tout de même, envoyez `hg reset --yes-i-know-what-im-doing`") }
                    }else{
                        if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                            try {
                                var data = db.getData("/game/" + message.author.id);
                            } catch(error) {
                                lstmsg = message
                                initErr();
                            };
                            editmsg = message
                            if (speakEnglish(message.author)) { message.channel.send(":file_cabinet: The profile for **" + message.author.username + "** is being reset, please wait...").then((message) => {
                                db.push("/game/" + message.author.id + "/level", 0);
                            db.push("/game/" + message.author.id + "/xp", 20);
                            db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                            db.push("/game/" + message.author.id + "/objects/irons", 0);
                            db.push("/game/" + message.author.id + "/objects/golds", 0);
                            db.push("/game/" + message.author.id + "/objects/woods", 5);
                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                            if (speakEnglish(message.author)) { message.edit(":white_check_mark: Profile for **" + message.author.username + "* was successfully reset to default values") } else { message.edit(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.") }
                            }) } else { message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...").then((message) => {
                                db.push("/game/" + message.author.id + "/level", 0);
                            db.push("/game/" + message.author.id + "/xp", 20);
                            db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                            db.push("/game/" + message.author.id + "/objects/irons", 0);
                            db.push("/game/" + message.author.id + "/objects/golds", 0);
                            db.push("/game/" + message.author.id + "/objects/woods", 5);
                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                            if (speakEnglish(message.author)) { message.edit(":white_check_mark: Profile for **" + message.author.username + "* was successfully reset to default values") } else { message.edit(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.") }
                            }) }
                        }else{
            if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initErr();
                };
                if (speakEnglish(message.author)) { message.channel.send(":file_cabinet: The profile for **" + message.author.username + "** is being reset, please wait...").then((message) => {
                    db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                if (speakEnglish(message.author)) { message.edit(":white_check_mark: Profile for **" + message.author.username + "* was successfully reset to default values") } else { message.edit(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.") }
                }) } else { message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...").then((message) => {
                    db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                if (speakEnglish(message.author)) { message.edit(":white_check_mark: Profile for **" + message.author.username + "* was successfully reset to default values") } else { message.edit(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.") }
                }) }
            }else{
                if (message.content == 'hg shop') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    if (speakEnglish(message.author)) { message.channel.send(":shopping_bags: **Welcome to Plug² shop, " + message.author.username + "! Here is what we have right now:**\n\n:shopping_cart: **On the shelf:**\n1 :: `5⛏` :: 1 iron ingot\n2 :: `5🏳️` :: 1 gold nugget\n3 :: `5🔶` :: 1 diamond\n4 :: `3🔷` :: Pionnier role\n\n:gift: **Make a gift:**\n1 :: `10⛏` :: Gift 10 wooden planks\n2 :: `10🏳️` :: Gift 10 iron ingots\n3 :: `10🔶` :: Gift 10 gold nuggets\n4 :: `10🎚` :: Gift 10 XP points\n\n:moneybag: **Your balance:**\n     :level_slider: **XP points for current level**: " + xp + "/500\n     :large_blue_diamond: **Diamonds**: " + diamonds + "\n     :large_orange_diamond: **Gold nuggets**: " + golds + "\n     :flag_white: **Iron ingots**: " + irons + "\n     :pick: **Wooden planks**: " + woods + "\n\n**Commands:**\nBuy a thing: `hg shop [ElementIdentifier]`\nMake a gift: `hg give [GiftIdentifier] [UserPing]`\nRedeem awaiting packages: `hg redeem`") } else { message.channel.send(":shopping_bags: **Bienvenue dans la boutique Plug², " + message.author.username + " ! Voici les articles que nous avons actuellement :**\n\n:shopping_cart: **En stock :**\n1 :: `5⛏` :: 1 lingot de fer\n2 :: `5🏳️` :: 1 pépite d'or\n3 :: `5🔶` :: 1 diamant\n4 :: `3🔷` :: Grade Pionnier\n\n:gift: **Donner en cadeau :**\n1 :: `10⛏` :: Donner 10 planches de bois\n2 :: `10🏳️` :: Donner 10 lingots de fer\n3 :: `10🔶` :: Donner 10 pépites d'or\n4 :: `10🎚` :: Donner 10 points d'expérience\n\n:moneybag: **Votre solde :**\n     :level_slider: **Points d'expérience pour le niveau actuel** : " + xp + "/500\n     :large_blue_diamond: **Diamants** : " + diamonds + "\n     :large_orange_diamond: **Pépites d'or** : " + golds + "\n     :flag_white: **Lingots de fer** : " + irons + "\n     :pick: **Planches de bois** : " + woods + "\n\n**Commandes :**\nAcheter un article : `hg shop [IdentifiantArticle]`\nFaire un cadeau : `hg give [IdentifiantCadeau] [MentionUtilisateur]`\nRécupérer les cadeaux : `hg redeem`") }
                }}else{
                if (message.content.startsWith("hg shop ")) {
                    lstmsg = message
                    checkShop();
                }else{
                    if (message.content.startsWith("hg give ")) {
                        lstmsg = message
                        checkGift();
                    }else{
                        if (message.content == 'hg give') {
                            if (speakEnglish(message.author)) { message.channel.send(":gift: **`hg give` is used to donate to an user**\n\n**Syntax:**\n       `hg give <GiftIdentifier> <UserPing>`\n\n**Conditions:**\n       **1.** Gift identifier needs to be valid. You can use `hg shop` to see more...\n       **2.** User needs to be on this server\n       **3.** User needs to have initialized its profile") } else { message.channel.send(":gift: **`hg give` permet de faire un don à un membre**\n\n**Syntaxe :**\n       `hg give <IdentifiantCadeau> <MentionUtilisateur>`\n\n**Conditions :**\n       **1.** L'identifiant cadeau doit être valide. Vous pouvez utiliser `hg shop` pour en savoir plus...\n       **2.** L'utilisateur doit être présent sur le serveur\n       **3.** L'utilisateur doit déjà avoir initialisé son profil") }
                        }else{
                            if (message.content == 'hg redeem') {
                                try {
                                    var data = db.getData("/game/" + message.author.id);
                                } catch(error) {
                                    lstmsg = message
                                    initErr();
                                };
                                if (data) {
                                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                                    var xp = db.getData("/game/" + message.author.id + "/xp")
                                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                                    if (xpBottle >= 1 || woodPack >= 1 || ironPack >= 1 || goldPack >= 1) {
                                        if (xpBottle >= 1) {
                                            var gainXp = xpBottle * 10
                                            db.push("/game/" + message.author.id + "/xp", xp + (xpBottle * 10))
                                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0)
                                        }else{
                                            var gainXp = 0
                                        }
                                        if (woodPack >= 1) {
                                            var gainWood = woodPack * 10
                                            db.push("/game/" + message.author.id + "/objects/woods", woods + (woodPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0)
                                        }else{
                                            var gainWood = 0
                                        }
                                        if (ironPack >= 1) {
                                            var gainIron = ironPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", irons + (ironPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0)
                                        }else{
                                            var gainIron = 0
                                        }
                                        if (goldPack >= 1) {
                                            var gainGold = goldPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", golds + (goldPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0)
                                        }else{
                                            var gainGold = 0
                                        }
                                        if (speakEnglish(message.author)) { message.channel.send(":gift: **All packages was been opened!**\n\n__**Results:**__\n**+" + gainXp + "** XP points\n**+" + gainWood + "** wooden planks\n**+" + gainIron + "** iron ingots\n**+" + gainGold + "** gold nuggets") } else { message.channel.send(":gift: **Tous les packets ont bien été ouverts !**\n\n__**Résultats :**__\n**+" + gainXp + "** points d'expérience\n**+" + gainWood + "** planches de bois\n**+" + gainIron + "** lingots de fer\n**+" + gainGold + "** pépites d'or") }
                                    }else{
                                        if (speakEnglish(message.author)) { message.channel.send(":no_entry: It looks like you don't have any awaiting package...") } else { message.channel.send(":no_entry: Vous n'avez aucun lot Bonus à récupérer...") }
                                    }
                                }
                            }else{
                if (message.content.startsWith('hg te ')) {
                    let args = message.content.split(' ');
                                args.shift();
                                let part1 = args.join(' ')
                                args = part1.split(' ');
                                args.shift();
                                let text = args.join(' ')
                                translate(text, {to: 'en'}).then(res => {
                                    if (res.from.language.iso) {
                                        if (res.from.language.iso == "fr") { if (speakEnglish(message.author)) { var language = "**French**" } else { var language = "le **français**" } }
                                        if (res.from.language.iso == "en") { if (speakEnglish(message.author)) { var language = "**English**" } else { var language = "l'**anglais**" } }
                                        if (res.from.language.iso == "nl") { if (speakEnglish(message.author)) { var language = "**Dutch**" } else { var language = "le **néerlandais**" } }
                                        if (res.from.language.iso == "es") { if (speakEnglish(message.author)) { var language = "**Spanish**" } else { var language = "le **espagnol**" } }
                                        if (res.from.language.iso == "ja") { if (speakEnglish(message.author)) { var language = "**Japanese**" } else { var language = "le **japonais**" } }
                                        if (res.from.language.iso == "af") { if (speakEnglish(message.author)) { var language = "**African**" } else { var language = "l'**africain**" } }
                                        if (res.from.language.iso == "ca") { if (speakEnglish(message.author)) { var language = "**Catalan**" } else { var language = "le **catalan**" } }
                                        if (res.from.language.iso == "co") { if (speakEnglish(message.author)) { var language = "**Corsica**" } else { var language = "le **corse**" } }
                                        if (res.from.language.iso == "cs") { if (speakEnglish(message.author)) { var language = "**Czech**" } else { var language = "le **tchèque**" } }
                                        if (res.from.language.iso == "da") { if (speakEnglish(message.author)) { var language = "**Danish**" } else { var language = "le **danois**" } }
                                        if (res.from.language.iso == "de") { if (speakEnglish(message.author)) { var language = "**German**" } else { var language = "le **allemand**" } }
                                        if (res.from.language.iso == "fi") { if (speakEnglish(message.author)) { var language = "**Finnish**" } else { var language = "le **finnois**" } }
                                        if (res.from.language.iso == "hr") { if (speakEnglish(message.author)) { var language = "**Croatian**" } else { var language = "le **croate**" } }
                                        if (res.from.language.iso == "ie") { if (speakEnglish(message.author)) { var language = "**western language**" } else { var language = "la **langue occidentale**" } }
                                        if (res.from.language.iso == "it") { if (speakEnglish(message.author)) { var language = "**Italian**" } else { var language = "le **italien**" } }
                                        if (res.from.language.iso == "ko") { if (speakEnglish(message.author)) { var language = "**Korean**" } else { var language = "le **coréen**" } }
                                        if (res.from.language.iso == "la") { if (speakEnglish(message.author)) { var language = "**Latin**" } else { var language = "le **latin**" } }
                                        if (res.from.language.iso == "pl") { if (speakEnglish(message.author)) { var language = "**Polish**" } else { var language = "le **polonais**" } }
                                        if (res.from.language.iso == "pt") { if (speakEnglish(message.author)) { var language = "**Portuguese**" } else { var language = "le **portugais**" } }
                                        if (res.from.language.iso == "sk") { if (speakEnglish(message.author)) { var language = "**Slovak**" } else { var language = "le **slovaque**" } }
                                        if (res.from.language.iso == "sv") { if (speakEnglish(message.author)) { var language = "**Swedish**" } else { var language = "le **suédois**" } }
                                        if (res.from.language.iso == "ty") { if (speakEnglish(message.author)) { var language = "**Tahitian**" } else { var language = "le **tahitien**" } }
                                        if (res.from.language.iso == "tr") { if (speakEnglish(message.author)) { var language = "**Turkish**" } else { var language = "le **turc**" } }
                                        if (res.from.language.iso == "uk") { if (speakEnglish(message.author)) { var language = "**Ukrainian**" } else { var language = "l'**ukrainien**" } }
                                        if (res.from.language.iso == "zh") { if (speakEnglish(message.author)) { var language = "**Chinese**" } else { var language = "le **chinois**" } }
                                    }else{
                                        if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" }
                                    }
                                    if (res.from.text.autoCorrected == true) {
                                        if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                        if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Corrected text: **" + res.from.text.value + "**\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language) };
                                    }else{
                                        if (res.from.text.didYouMean) {
                                            if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                            if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Did you mean **" + res.from.text.value + "?**...\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe : **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language) };
                                        }else{
                                            if (res.text) {
                                                if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                                if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language) };}else{
                                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: No results for **" + res.from.text.value + "**") } else { message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**") }
                                }
                            }}}).catch(err => {
                                if (speakEnglish(message.author)) { message.channel.send(":no_entry: **Sorry**, but an error as ocurred:\n```\n" + err + "\n```") } else { message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```") }
                                console.log(err);
                });
                }else{
                    if (message.content.startsWith('hg tf ')) {
                        let args = message.content.split(' ');
                                args.shift();
                                let part1 = args.join(' ')
                                args = part1.split(' ');
                                args.shift();
                                let text = args.join(' ')
                                translate(text, {to: 'fr'}).then(res => {
                                    if (res.from.language.iso) {
                                        if (res.from.language.iso == "fr") { if (speakEnglish(message.author)) { var language = "**French**" } else { var language = "le **français**" } }
                                        if (res.from.language.iso == "en") { if (speakEnglish(message.author)) { var language = "**English**" } else { var language = "l'**anglais**" } }
                                        if (res.from.language.iso == "nl") { if (speakEnglish(message.author)) { var language = "**Dutch**" } else { var language = "le **néerlandais**" } }
                                        if (res.from.language.iso == "es") { if (speakEnglish(message.author)) { var language = "**Spanish**" } else { var language = "le **espagnol**" } }
                                        if (res.from.language.iso == "ja") { if (speakEnglish(message.author)) { var language = "**Japanese**" } else { var language = "le **japonais**" } }
                                        if (res.from.language.iso == "af") { if (speakEnglish(message.author)) { var language = "**African**" } else { var language = "l'**africain**" } }
                                        if (res.from.language.iso == "ca") { if (speakEnglish(message.author)) { var language = "**Catalan**" } else { var language = "le **catalan**" } }
                                        if (res.from.language.iso == "co") { if (speakEnglish(message.author)) { var language = "**Corsica**" } else { var language = "le **corse**" } }
                                        if (res.from.language.iso == "cs") { if (speakEnglish(message.author)) { var language = "**Czech**" } else { var language = "le **tchèque**" } }
                                        if (res.from.language.iso == "da") { if (speakEnglish(message.author)) { var language = "**Danish**" } else { var language = "le **danois**" } }
                                        if (res.from.language.iso == "de") { if (speakEnglish(message.author)) { var language = "**German**" } else { var language = "le **allemand**" } }
                                        if (res.from.language.iso == "fi") { if (speakEnglish(message.author)) { var language = "**Finnish**" } else { var language = "le **finnois**" } }
                                        if (res.from.language.iso == "hr") { if (speakEnglish(message.author)) { var language = "**Croatian**" } else { var language = "le **croate**" } }
                                        if (res.from.language.iso == "ie") { if (speakEnglish(message.author)) { var language = "**western language**" } else { var language = "la **langue occidentale**" } }
                                        if (res.from.language.iso == "it") { if (speakEnglish(message.author)) { var language = "**Italian**" } else { var language = "le **italien**" } }
                                        if (res.from.language.iso == "ko") { if (speakEnglish(message.author)) { var language = "**Korean**" } else { var language = "le **coréen**" } }
                                        if (res.from.language.iso == "la") { if (speakEnglish(message.author)) { var language = "**Latin**" } else { var language = "le **latin**" } }
                                        if (res.from.language.iso == "pl") { if (speakEnglish(message.author)) { var language = "**Polish**" } else { var language = "le **polonais**" } }
                                        if (res.from.language.iso == "pt") { if (speakEnglish(message.author)) { var language = "**Portuguese**" } else { var language = "le **portugais**" } }
                                        if (res.from.language.iso == "sk") { if (speakEnglish(message.author)) { var language = "**Slovak**" } else { var language = "le **slovaque**" } }
                                        if (res.from.language.iso == "sv") { if (speakEnglish(message.author)) { var language = "**Swedish**" } else { var language = "le **suédois**" } }
                                        if (res.from.language.iso == "ty") { if (speakEnglish(message.author)) { var language = "**Tahitian**" } else { var language = "le **tahitien**" } }
                                        if (res.from.language.iso == "tr") { if (speakEnglish(message.author)) { var language = "**Turkish**" } else { var language = "le **turc**" } }
                                        if (res.from.language.iso == "uk") { if (speakEnglish(message.author)) { var language = "**Ukrainian**" } else { var language = "l'**ukrainien**" } }
                                        if (res.from.language.iso == "zh") { if (speakEnglish(message.author)) { var language = "**Chinese**" } else { var language = "le **chinois**" } }
                                    }else{
                                        if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" }
                                    }
                                    if (res.from.text.autoCorrected == true) {
                                        if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                        if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Corrected text: **" + res.from.text.value + "**\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language) };
                                    }else{
                                        if (res.from.text.didYouMean) {
                                            if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                            if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Did you mean **" + res.from.text.value + "?**...\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe : **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language) };
                                        }else{
                                            if (res.text) {
                                                if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                                if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language) };}else{
                                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: No results for **" + res.from.text.value + "**") } else { message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**") }
                                }
                            }}}).catch(err => {
                                if (speakEnglish(message.author)) { message.channel.send(":no_entry: **Sorry**, but an error as ocurred:\n```\n" + err + "\n```") } else { message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```") }
                                console.log(err);
                    });
                    }else{
                        if (message.content.startsWith('hg tj ')) {
                            let args = message.content.split(' ');
                                args.shift();
                                let part1 = args.join(' ')
                                args = part1.split(' ');
                                args.shift();
                                let text = args.join(' ')
                                translate(text, {to: 'ja'}).then(res => {
                                    if (res.from.language.iso) {
                                        if (res.from.language.iso == "fr") { if (speakEnglish(message.author)) { var language = "**French**" } else { var language = "le **français**" } }
                                        if (res.from.language.iso == "en") { if (speakEnglish(message.author)) { var language = "**English**" } else { var language = "l'**anglais**" } }
                                        if (res.from.language.iso == "nl") { if (speakEnglish(message.author)) { var language = "**Dutch**" } else { var language = "le **néerlandais**" } }
                                        if (res.from.language.iso == "es") { if (speakEnglish(message.author)) { var language = "**Spanish**" } else { var language = "le **espagnol**" } }
                                        if (res.from.language.iso == "ja") { if (speakEnglish(message.author)) { var language = "**Japanese**" } else { var language = "le **japonais**" } }
                                        if (res.from.language.iso == "af") { if (speakEnglish(message.author)) { var language = "**African**" } else { var language = "l'**africain**" } }
                                        if (res.from.language.iso == "ca") { if (speakEnglish(message.author)) { var language = "**Catalan**" } else { var language = "le **catalan**" } }
                                        if (res.from.language.iso == "co") { if (speakEnglish(message.author)) { var language = "**Corsica**" } else { var language = "le **corse**" } }
                                        if (res.from.language.iso == "cs") { if (speakEnglish(message.author)) { var language = "**Czech**" } else { var language = "le **tchèque**" } }
                                        if (res.from.language.iso == "da") { if (speakEnglish(message.author)) { var language = "**Danish**" } else { var language = "le **danois**" } }
                                        if (res.from.language.iso == "de") { if (speakEnglish(message.author)) { var language = "**German**" } else { var language = "le **allemand**" } }
                                        if (res.from.language.iso == "fi") { if (speakEnglish(message.author)) { var language = "**Finnish**" } else { var language = "le **finnois**" } }
                                        if (res.from.language.iso == "hr") { if (speakEnglish(message.author)) { var language = "**Croatian**" } else { var language = "le **croate**" } }
                                        if (res.from.language.iso == "ie") { if (speakEnglish(message.author)) { var language = "**western language**" } else { var language = "la **langue occidentale**" } }
                                        if (res.from.language.iso == "it") { if (speakEnglish(message.author)) { var language = "**Italian**" } else { var language = "le **italien**" } }
                                        if (res.from.language.iso == "ko") { if (speakEnglish(message.author)) { var language = "**Korean**" } else { var language = "le **coréen**" } }
                                        if (res.from.language.iso == "la") { if (speakEnglish(message.author)) { var language = "**Latin**" } else { var language = "le **latin**" } }
                                        if (res.from.language.iso == "pl") { if (speakEnglish(message.author)) { var language = "**Polish**" } else { var language = "le **polonais**" } }
                                        if (res.from.language.iso == "pt") { if (speakEnglish(message.author)) { var language = "**Portuguese**" } else { var language = "le **portugais**" } }
                                        if (res.from.language.iso == "sk") { if (speakEnglish(message.author)) { var language = "**Slovak**" } else { var language = "le **slovaque**" } }
                                        if (res.from.language.iso == "sv") { if (speakEnglish(message.author)) { var language = "**Swedish**" } else { var language = "le **suédois**" } }
                                        if (res.from.language.iso == "ty") { if (speakEnglish(message.author)) { var language = "**Tahitian**" } else { var language = "le **tahitien**" } }
                                        if (res.from.language.iso == "tr") { if (speakEnglish(message.author)) { var language = "**Turkish**" } else { var language = "le **turc**" } }
                                        if (res.from.language.iso == "uk") { if (speakEnglish(message.author)) { var language = "**Ukrainian**" } else { var language = "l'**ukrainien**" } }
                                        if (res.from.language.iso == "zh") { if (speakEnglish(message.author)) { var language = "**Chinese**" } else { var language = "le **chinois**" } }
                                    }else{
                                        if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" }
                                    }
                                    if (res.from.text.autoCorrected == true) {
                                        if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                        if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Corrected text: **" + res.from.text.value + "**\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language) };
                                    }else{
                                        if (res.from.text.didYouMean) {
                                            if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                            if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Did you mean **" + res.from.text.value + "?**...\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe : **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language) };
                                        }else{
                                            if (res.text) {
                                                if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                                if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language) };}else{
                                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: No results for **" + res.from.text.value + "**") } else { message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**") }
                                }
                            }}}).catch(err => {
                                if (speakEnglish(message.author)) { message.channel.send(":no_entry: **Sorry**, but an error as ocurred:\n```\n" + err + "\n```") } else { message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```") }
                                console.log(err);
                        });
                        }else{
                            if (message.content.startsWith('hg tl ')) {
                                let args = message.content.split(' ');
                                args.shift();
                                let part1 = args.join(' ')
                                args = part1.split(' ');
                                args.shift();
                                let text = args.join(' ')
                                translate(text, {to: 'la'}).then(res => {
                                    if (res.from.language.iso) {
                                        if (res.from.language.iso == "fr") { if (speakEnglish(message.author)) { var language = "**French**" } else { var language = "le **français**" } }
                                        if (res.from.language.iso == "en") { if (speakEnglish(message.author)) { var language = "**English**" } else { var language = "l'**anglais**" } }
                                        if (res.from.language.iso == "nl") { if (speakEnglish(message.author)) { var language = "**Dutch**" } else { var language = "le **néerlandais**" } }
                                        if (res.from.language.iso == "es") { if (speakEnglish(message.author)) { var language = "**Spanish**" } else { var language = "le **espagnol**" } }
                                        if (res.from.language.iso == "ja") { if (speakEnglish(message.author)) { var language = "**Japanese**" } else { var language = "le **japonais**" } }
                                        if (res.from.language.iso == "af") { if (speakEnglish(message.author)) { var language = "**African**" } else { var language = "l'**africain**" } }
                                        if (res.from.language.iso == "ca") { if (speakEnglish(message.author)) { var language = "**Catalan**" } else { var language = "le **catalan**" } }
                                        if (res.from.language.iso == "co") { if (speakEnglish(message.author)) { var language = "**Corsica**" } else { var language = "le **corse**" } }
                                        if (res.from.language.iso == "cs") { if (speakEnglish(message.author)) { var language = "**Czech**" } else { var language = "le **tchèque**" } }
                                        if (res.from.language.iso == "da") { if (speakEnglish(message.author)) { var language = "**Danish**" } else { var language = "le **danois**" } }
                                        if (res.from.language.iso == "de") { if (speakEnglish(message.author)) { var language = "**German**" } else { var language = "le **allemand**" } }
                                        if (res.from.language.iso == "fi") { if (speakEnglish(message.author)) { var language = "**Finnish**" } else { var language = "le **finnois**" } }
                                        if (res.from.language.iso == "hr") { if (speakEnglish(message.author)) { var language = "**Croatian**" } else { var language = "le **croate**" } }
                                        if (res.from.language.iso == "ie") { if (speakEnglish(message.author)) { var language = "**western language**" } else { var language = "la **langue occidentale**" } }
                                        if (res.from.language.iso == "it") { if (speakEnglish(message.author)) { var language = "**Italian**" } else { var language = "le **italien**" } }
                                        if (res.from.language.iso == "ko") { if (speakEnglish(message.author)) { var language = "**Korean**" } else { var language = "le **coréen**" } }
                                        if (res.from.language.iso == "la") { if (speakEnglish(message.author)) { var language = "**Latin**" } else { var language = "le **latin**" } }
                                        if (res.from.language.iso == "pl") { if (speakEnglish(message.author)) { var language = "**Polish**" } else { var language = "le **polonais**" } }
                                        if (res.from.language.iso == "pt") { if (speakEnglish(message.author)) { var language = "**Portuguese**" } else { var language = "le **portugais**" } }
                                        if (res.from.language.iso == "sk") { if (speakEnglish(message.author)) { var language = "**Slovak**" } else { var language = "le **slovaque**" } }
                                        if (res.from.language.iso == "sv") { if (speakEnglish(message.author)) { var language = "**Swedish**" } else { var language = "le **suédois**" } }
                                        if (res.from.language.iso == "ty") { if (speakEnglish(message.author)) { var language = "**Tahitian**" } else { var language = "le **tahitien**" } }
                                        if (res.from.language.iso == "tr") { if (speakEnglish(message.author)) { var language = "**Turkish**" } else { var language = "le **turc**" } }
                                        if (res.from.language.iso == "uk") { if (speakEnglish(message.author)) { var language = "**Ukrainian**" } else { var language = "l'**ukrainien**" } }
                                        if (res.from.language.iso == "zh") { if (speakEnglish(message.author)) { var language = "**Chinese**" } else { var language = "le **chinois**" } }
                                    }else{
                                        if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" }
                                    }
                                    if (res.from.text.autoCorrected == true) {
                                        if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                        if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Corrected text: **" + res.from.text.value + "**\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language) };
                                    }else{
                                        if (res.from.text.didYouMean) {
                                            if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                            if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:warning: Did you mean **" + res.from.text.value + "?**...\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe : **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language) };
                                        }else{
                                            if (res.text) {
                                                if (language === undefined) { if (speakEnglish(message.author)) { var language = "various languages" } else { var language = "plusieurs langues" } }
                                                if (speakEnglish(message.author)) { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Translated from " + language) } else { message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language) };}else{
                                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: No results for **" + res.from.text.value + "**") } else { message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**") }
                                }
                            }}}).catch(err => {
                                if (speakEnglish(message.author)) { message.channel.send(":no_entry: **Sorry**, but an error as ocurred:\n```\n" + err + "\n```") } else { message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```") }
                                console.log(err);
                            });
                            }else if (message.content.startsWith('hg help')) {
                                if (speakEnglish(message.author)) { message.channel.send(":question: **What can we do with ~~Horizon~~ __Horigame__?**\n\nHelp looks like that:\n`hg [command] [required:type] (optional:type)`\n     Commands details\n     Required elements: `guild`\n\n__Help:__\n`hg shop (identifier:shopId)`\n     Used to buy an object on Plug² shop, or see what's on the shelf\n     Required elements: `guild`,`profile`\n\n`hg stats (null:null)`\n     Show your statistics\n     Required elements: `guild`,`profile`\n\n`hg give [identifier:giftId] [member:snowflake]`\n     Donate to a user\n     Required elements: `guild`,`profile`,`balance > 0`\n\n`hg t[language:1charlang] [text:string]`\n     Translate a text to another language (`f` for french, `e` for english, `j` for japanese, and `l` for latin)\n     Required elements: `guild`,`googleTranslateApi`\n\n`hg redeem (null:null)`\n     Redeem awaiting packages\n     Required elements: `guild`,`profile`,`redeemablePacks > 0`\n\n`hg help (null:null)`\n     Show this help message\n     Required elements: `guild`\n\n`hg reset (*)`\n     Reset your profile\n     Required profile: `guild`,`profile`\n\n`hg init (null:null)`\n     Initialize your profile\n     Required elements: `guild`,`noProfile`\n\n`hg push [channel:pushchannel]`\n     Alter notifications settings\n     Required elements: `guild`,`profile`\n\n`hg fr (null:null)`\n     Sets your personal language to french\n     Required elements: `guild`,`profile`\n\n`hg en (null:null)`\n     Sets your personal language to english\n    Required elements: `guild`,`profile`") } else { message.channel.send(":question: **Que pouvons nous donc faire avec ~~Horizon~~ __Horigame__ ?**\n\nL'aide sera présentée ainsi :\n`hg [commande] [obligatoire:type] (facultatif:type)`\n     Détails de la commande\n     Éléments requis : `guild`\n\n__Aide :__\n`hg shop (identifiant:shopId)`\n     Permet d'acheter un objet dans la boutique Plug², ou de consulter les stocks\n     Éléments requis : `guild`,`profile`\n\n`hg stats (null:null)`\n     Affiche vos statistiques\n     Éléments requis : `guild`,`profile`\n\n`hg give [identifiant:giftId] [utilisateur:snowflake]`\n     Fait un don à un autre utilisateur\n     Éléments requis : `guild`,`profile`,`balance > 0`\n\n`hg t[langue:1charlang] [texte:string]`\n     Traduit un texte en une langue (`f` pour français, `e` pour anglais, `j` pour japonais, et `l` pour latin)\n     Éléments requis : `guild`,`googleTranslateApi`\n\n`hg redeem (null:null)`\n     Récupère les lots en attente\n     Éléments requis : `guild`,`profile`,`redeemablePacks > 0`\n\n`hg help (null:null)`\n     Affiche ce message d'aide\n     Éléments requis : `guild`\n\n`hg reset (*)`\n     Réinitialise votre profil\n     Éléments requis : `guild`,`profile`\n\n`hg init (null:null)`\n     Initialise votre profil utilisateur\n     Éléments requis : `guild`,`noProfile`\n\n`hg push [canal:pushchannel]`\n     Altère les préférences de notification\n     Éléments requis : `guild`,`profile`\n\n`hg fr (null:null)`\n     Définit votre langue personnelle sur le français\n     Éléments requis : `guild`,`profile`\n\n`hg en (null:null)`\n     Définit votre langue personnelle sur l'anglais\n     Éléments requis : `guild`,`profile`") }
                            }else if (message.content.startsWith('hg push')) {
                                try {
                                    var data = db.getData("/game/" + message.author.id);
                                } catch(error) {
                                    lstmsg = message
                                    initErr();
                                };
                                if (data) {
                                if (message.content == "hg push levels") {
                                    try {
                                        var pushLevels = uconf.getData("/push/" + message.author.id + "/levels")
                                    } catch(err) {
                                        var pushLevels = true
                                    }
                                    if (pushLevels === true) {
                                        uconf.push("/push/" + message.author.id + "/levels", false)
                                        if (speakEnglish(message.author)) { message.channel.send(':no_bell: Notifications settings edited: `' + message.author.id + '.push.levels` is now set to `false`') } else { message.channel.send(':no_bell: Paramètres de notifications modifiés : `' + message.author.id + '.push.levels` est passé à `false`') }
                                    }
                                    if (pushLevels === false) {
                                        uconf.push("/push/" + message.author.id + "/levels", true)
                                        if (speakEnglish(message.author)) { message.channel.send(':bell: Notifications settings edited: `' + message.author.id + '.push.levels` is now set to `true`') } else { message.channel.send(':bell: Paramètres de notifications modifiés : `' + message.author.id + '.push.levels` est passé à `true`') }
                                    }
                                } else if (message.content == "hg push gifts") {
                                    try {
                                        var pushLevels = uconf.getData("/push/" + message.author.id + "/gifts")
                                    } catch(err) {
                                        var pushLevels = true
                                    }
                                    if (pushLevels === true) {
                                        uconf.push("/push/" + message.author.id + "/gifts", false)
                                        if (speakEnglish(message.author)) { message.channel.send(':no_bell: Notifications settings edited: `' + message.author.id + '.push.gifts` is now set to `false`') } else { message.channel.send(':no_bell: Paramètres de notifications modifiés : `' + message.author.id + '.push.gifts` est passé à `false`') }
                                    }
                                    if (pushLevels === false) {
                                        uconf.push("/push/" + message.author.id + "/gifts", true)
                                        if (speakEnglish(message.author)) { message.channel.send(':bell: Notifications settings edited: `' + message.author.id + '.push.gifts` is now set to `true`') } else { message.channel.send(':bell: Paramètres de notifications modifiés : `' + message.author.id + '.push.gifts` est passé à `true`') }
                                    }
                                } else if (message.content == "hg push") {
                                    if (speakEnglish(message.author)) { message.channel.send("**`hg push` can be used to manage Horigame's notification settings by specific channels.**\n\n**Note:** Horigame's notification are sent on direct messages.\n\n__**Available notification channels:**__\n`levels` - Notifications when you pass a level\n`gifts` - Notifications when you recieve gifts\n\nUse `hg push [channel]` to alter configuration.") } else { message.channel.send("**`hg push` vous permet de gérer vos paramètres de notification de Horigame pour des canaux particuliers.**\n\n**Note :** Les notifications de Horigame vous sont envoyées par messages privés.\n\n__**Canaux de notification disponibles :**__\n`levels` - Messages lorsque vous passez un niveau\n`gifts` - Messages lorsque vous recevez des lots en cadeau.\n\nUtilisez `hg push [canal]` pour altérer la configuration.") }
                                } else {
                                    let args = message.content.split(' ');
                                    args.shift();
                                    let text = args.join(' ')
                                    args = text.split(' ');
                                    args.shift();
                                    text = args.join(' ')
                                    if (speakEnglish(message.author)) { message.channel.send(":no_entry: Notification channel **" + text + "** cannot be found. Use `hg push` to get help... - `" + message.author.username + "`") } else { message.channel.send(":no_entry: Le canal de notifications **" + text + "** n'a pas pu être trouvé. Utilisez `hg push` pour obtenir de l'aide... - `" + message.author.username + "`") }
                                }}
                            }else if (message.content.startsWith('hg manga')) {
                                if (message.author.id == "294910706250285056") {

                                } else {
                                    if (speakEnglish(message.author)) { message.channel.send(':no_entry_sign: Actually, only **Minteck** can use the `hg manga` command.') } else { message.channel.send(':no_entry_sign: Actuellement, seul **Minteck** peut utiliser la commande `hg manga`') }
                                }
                            }else if (message.content.startsWith('hg fr')) {
                                uconf.push('/lang/' + message.author.id, 'fr')
                                message.channel.send(":flag_fr: C'est bon, votre langue personnelle à été définie sur **Français (France)** !")
                            }else if (message.content.startsWith('hg en')) {
                                uconf.push('/lang/' + message.author.id, 'en')
                                message.channel.send(":flag_us: Alright, your personal language was successfully set to **English (United States)**")
                            }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry_sign: **" + message.content + "** isn't recognized as an Horigame internal command. Check spelling and retry. - `" + message.author.username + "`") } else { message.channel.send(":no_entry_sign: **" + message.content + "** n'est pas reconnu en tant que commande interne de Horigame. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`") }
}}}}}}}}}}}}}}}}
try {
    var data = db.getData("/game/" + message.author.id);
} catch(error) {
};
if (data) {
    if (xpCooldown.has(message.author.id)) {blockXpUp();} else {
        xpCooldown.add(message.author.id);
    setTimeout(() => {
        xpCooldown.delete(message.author.id);
      }, 60000);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    db.push("/game/" + message.author.id + "/xp", userXp + 10);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    if (userXp >= 500) {
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        db.push("/game/" + message.author.id + "/level", userLevel + 1);
        db.push("/game/" + message.author.id + "/xp", 0);
        var planks = db.getData("/game/" + message.author.id + "/objects/woods");
        db.push("/game/" + message.author.id + "/objects/woods", planks + 15);
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        try { var setting = uconf.getData("/push/" + message.author.id + "/levels") } catch(err) { var setting = true }
        if (setting == true) { if (speakEnglish(message.author)) { message.author.send(":tools: Hi **" + message.author.username + "**, you're now on **level " + userLevel + "**, congratulations! *(and you won 15 wooden planks)*") } else { message.author.send(":tools: Salut **" + message.author.username + "**, tu es maintenant au **niveau " + userLevel + "**, félicitations ! *(et tu gagne 15 planches de bois)*") } }
    }
}}}}}}

function blockXpUp () {
    //Ne rien faire, juste empêcher l'utilisateur de gagner de l'expérience...
};

function blockMessage() {
    if (speakEnglish(lstmsg.author)) { lstmsg.channel.send(":warning: Hey! Why go at supersonic speed? Slow down!"); } else { lstmsg.channel.send(":warning: Et oh ! Vous allez trop vite ! Ralentissez un peu..."); }
};

function initErr() {
    lstmsg.channel.send(":no_entry: Aucun profil utilisateur correspondant à **" + lstmsg.author.username + "** n'a été trouvé. Exécutez la commande `hg init` pour en générer un...")
};

function initUser() {
    editmsg = lstmsg
    lstmsg.channel.send(":clock1: Patientez... L'initialisation du profil utilisateur de **" + lstmsg.author.username + "** est en cours...").then((message) => {
                db.push("/game/" + lstmsg.author.id + "/level", 0);
                db.push("/game/" + lstmsg.author.id + "/xp", 20);
                db.push("/game/" + lstmsg.author.id + "/objects/diamonds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/irons", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/golds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/woods", 5);
                db.push("/game/" + lstmsg.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/woodPack", 0);
                uconf.push('/lang/' + lstmsg.author.id, "fr");
                uconf.push('/push/' + lstmsg.author.id + "/levels", true);
                uconf.push('/push/' + lstmsg.author.id + "/gifts", true);
                message.edit(":white_check_mark: Votre profil utilisateur à été initialisé correctement, vous pouvez maintenant commencer à jouer ! - `" + editmsg.author.username + "`")
            })
}

function checkShop() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    if (selection == "1") {
        if (woods >= 5) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 5);
            db.push("/game/" + message.author.id + "/objects/irons", irons + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your command *#" + commandId + "* of **1 iron ingot** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 lingot de fer** a été validée - `" + message.author.username + "`") }
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + woods + " wooden planks**) is too low. To buy this object, you need at least **5 wooden planks**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + woods + " planches de bois**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 planches de bois**.") }
        }
    }else if (selection == "2") {
        if (irons >= 5) {
            db.push("/game/" + message.author.id + "/objects/irons", irons - 5);
            db.push("/game/" + message.author.id + "/objects/golds", golds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your command *#" + commandId + "* of **1 gold nugget** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 pépite d'or** a été validée - `" + message.author.username + "`") }
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + irons + " iron irons**) is too low. To buy this object, you need at least **5 iron ingots**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + irons + " lingots de fer**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 lingots de fer**.") }
        }
    }else if (selection == "3") {
        if (golds >= 5) {
            db.push("/game/" + message.author.id + "/objects/golds", golds - 5);
            db.push("/game/" + message.author.id + "/objects/diamonds", diamonds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your command *#" + commandId + "* of **1 diamant** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 diamant** a été validée - `" + message.author.username + "`") }
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + golds + " gold nuggets**) is too low. To buy this object, you need at least **5 gold nuggets**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 pépites d'or**.") }
        }
    }else if (selection == "4") {
        if (diamonds >= 3) {
            if (message.member.roles.find("id", config.pionnerRoleID)) {
                if (speakEnglish(message.author)) { message.channel.send(":no_entry: You already have this article. You can have it only one time.") } else { message.channel.send(":no_entry: Vous disposez déjà de cet article. Vous ne pouvez disposez que d'une seule unité de ce dernier.") }
            }else{
            db.push("/game/" + message.author.id + "/objects/golds", diamonds - 3);
            message.member.addRole(config.pionnerRoleID,"A acheté via la Boutique Plug²")
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your command *#" + commandId + "* of **Pionnier role** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* du **grade Pionnier** a été validée - `" + message.author.username + "`") }
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }}else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + diamonds + " diamonds**) is too low. To buy this object, you need at least **3 diamonds**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + diamonds + " diamants**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **3 diamants**.") }
        }
    }else{
        if (speakEnglish(message.author)) { message.channel.send(":no_entry_sign: The element **" + selection + "** isn't available in **Plug² Shop**. Check spelling and retry. - `" + message.author.username + "`") } else { message.channel.send(":no_entry_sign: L'article **" + selection + "** n'est pas ou plus disponible dans la **Boutique Plug²**. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`") }
}}

function checkGift() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var setting = uconf.getData("/push/" + message.author.id + "/gifts")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    var invalidUser = false
    try {
        var destUser = message.mentions.users.first().id
        var reciever = message.mentions.users.first()
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    try {
        var testing = db.getData("/game/" + destUser)
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    if (invalidUser === true) {
        giftInvalidUser();
    }
    if (destUser && testing) {
        var givenItself = false;
    if (destUser == message.author.id) {
        lstmsg = message
        giftCannotGiveYourself();
        givenItself = true;
    }
    if (givenItself === false) {
    if (selection.startsWith("1")) {
        if (woods >= 10) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 10);
            var destWoods = db.getData("/game/" + destUser + "/bonus/woodPack")
            db.push("/game/" + destUser + "/bonus/woodPack", destWoods + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 wooden planks** for **" + message.mentions.user.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 wooden planks** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`") }
            if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.user.first().send("🔔 You just received **10 wooden planks** from **" + message.author.username + "**. Use the `hg redeem` to redeem that...") } else { message.mentions.user.first().send("🔔 Vous avez reçu un pack de **10 planches de bois** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...") } }
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + woods + " wooden planks**) is too low. To donate, you need to have at least **10 wooden planks**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + woods + " planches de bois**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 planches de bois**.") }
        }}else if (selection.startsWith("2")) {
            if (irons >= 10) {
                db.push("/game/" + message.author.id + "/objects/irons", irons - 10);
                var destIrons = db.getData("/game/" + destUser + "/bonus/ironPack")
                db.push("/game/" + destUser + "/bonus/ironPack", destIrons + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 iron ingots** for **" + message.mentions.user.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 lingots de fer** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`") }
                if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.user.first().send("🔔 You just received **10 iron ingots** from **" + message.author.username + "**. Use the `hg redeem` to redeem that...") } else { message.mentions.user.first().send("🔔 Vous avez reçu un pack de **10 lingots de fer** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...") } }
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + irons + " iron ingots**) is too low. To donate, you need to have at least **10 iron ingots**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + irons + " lingots de fer**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 lingots de fer**.") }
            }
    }else if (selection.startsWith("3")) {
            if (golds >= 10) {
                db.push("/game/" + message.author.id + "/objects/golds", golds - 10);
                var destGolds = db.getData("/game/" + destUser + "/bonus/goldPack")
                db.push("/game/" + destUser + "/bonus/goldPack", destGolds + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 gold nuggets** for **" + message.mentions.user.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 pépites d'or** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`") }
                if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.user.first().send("🔔 You just received **10 gold nuggets** from **" + message.author.username + "**. Use the `hg redeem` to redeem that...") } else { message.mentions.user.first().send("🔔 Vous avez reçu un pack de **10 pépites d'or** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...") } }
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current balance (**" + golds + " gold nuggets**) is too low. To donate, you need to have at least **10 gold nuggets**.") } else { message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 pépites d'or**.") }
            }
    }else if (selection.startsWith("4")) {
        if (xp >= 10) {
            db.push("/game/" + message.author.id + "/xp", xp - 10);
            var destXp = db.getData("/game/" + destUser + "/bonus/xpBottle")
            db.push("/game/" + destUser + "/bonus/xpBottle", destXp + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            if (speakEnglish(message.author)) { message.channel.send(":white_check_mark: Your *#" + commandId + "* donation of **10 XP points** for **" + message.mentions.user.first().username + "** was done - `" + message.author.username + "`") } else { message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 points d'expérience** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`") }
            try { var setting = db.getData('/game/' + message.mentions.user.first().id + '/push/gifts') } catch(err) { var setting = true }
            if (setting === true) { if (speakEnglish(message.mentions.user.first())) { message.mentions.user.first().send("🔔 You just received a **XP bottle *(10 XP points)*** given by **" + message.author.username + "**. Use the `hg redeem` command to redeem it...") } else { message.mentions.user.first().send("🔔 Vous avez reçu une **fiole d'expérience *(10 points d'expérience)*** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...") } }
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Your current XP for this level (**" + xp + "/500**) is too low. To donate, you need to have at least **10/500**.") } else { message.channel.send(":no_entry: Votre expérience dans le niveau actuel actuel (**" + xp + "/500**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10/500**.") }
        }}else{
            if (speakEnglish(message.author)) { message.channel.send(":no_entry: Specified donation element cannot be found. Check spelling and retry... - `" + message.author.username + "`") } else { message.channel.send(":no_entry: L'élément de don avec l'identifiant spécifié est introuvable. Vérifiez l'orthographe et réessayez... - `" + message.author.username + "`") }
        }
}}}

function giftInvalidUser() {
    message = lstmsg
    var destUser
    try {
    destUser = message.mentions.users.first().username
    } catch(error) {}
    if (destUser) {
        if (speakEnglish(message.author)) { message.channel.send(":no_entry: User **" + destUser + "** doesn't initialized its profile.") } else { message.channel.send(":no_entry: L'utilisateur **" + destUser + "** n'a pas initialisé son profil.") }
    } else {
        if (speakEnglish(message.author)) { message.channel.send(":no_entry: Specified user cannot be found, or there's noone pinged...") } else { message.channel.send(":no_entry: L'utilisateur spécifié est introuvable, ou alors vous n'avez mentionné aucun utilisateur...") }
    }
}

function giftCannotGiveYourself() {
    message = lstmsg
    if (speakEnglish(message.author)) { message.channel.send(":no_entry: You cannot donate to yourself") } else { message.channel.send(":no_entry: Vous ne pouvez pas vous faire de don à vous même") }
}

function speakEnglish(member) {
    var langconf = uconf.getData('/lang/' + member.id)
    if (langconf == 'en') { return true; } else { return false; }
}

function showLog() {
    if (config.keepLogs == true) {
    var date = new Date();
    var hour = date.getHours() + 1;
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    console.log(time + " [" + shard.id + "] : " + loginfo)
    fs.appendFile("horigame.log", "\n" + time + " [" + shard.id + "] : " + loginfo, (error) => { /* handle error */ })
    }else{
        var date = new Date();
        var hour = date.getHours() + 1;
        hour = (hour < 10 ? "0" : "") + hour;
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
        console.log("[Horigame] [" + shard.id + "] " + time + " : " + loginfo)
}}