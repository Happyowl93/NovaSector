/obj/machinery/computer/bank_machine
	/// Station departmental accounts that can be selected from the vault bank machine.
	var/static/list/selectable_departments = list(
		ACCOUNT_CAR,
		ACCOUNT_CMD,
		ACCOUNT_ENG,
		ACCOUNT_MED,
		ACCOUNT_SCI,
		ACCOUNT_SEC,
		ACCOUNT_SRV,
		ACCOUNT_CIV,
	)
	/// TGUI button colors for the selectable departmental accounts.
	var/static/list/department_button_colors = list(
		ACCOUNT_CAR = "brown",
		ACCOUNT_CMD = "blue",
		ACCOUNT_ENG = "orange",
		ACCOUNT_MED = "green",
		ACCOUNT_SCI = "purple",
		ACCOUNT_SEC = "red",
		ACCOUNT_SRV = "yellow",
		ACCOUNT_CIV = "teal",
	)

/obj/machinery/computer/bank_machine/ui_data(mob/user)
	. = ..()

	var/total_balance = 0
	var/list/departments = list()
	for(var/department_id as anything in selectable_departments)
		var/datum/bank_account/department/department_account = SSeconomy.get_dep_account(department_id)
		if(isnull(department_account))
			continue

		total_balance += department_account.account_balance
		departments += list(list(
			"id" = department_id,
			"name" = department_account.account_holder,
			"balance" = department_account.account_balance,
			"color" = department_button_colors[department_id],
			"selected" = department_account == synced_bank_account,
		))

	.["departments"] = departments
	.["selected_department"] = synced_bank_account?.account_holder || "No Budget"
	.["total_balance"] = total_balance

/obj/machinery/computer/bank_machine/ui_act(action, params, datum/tgui/ui)
	. = ..()
	if(. || action != "select_department")
		return

	if(siphoning)
		say("Error: Halt withdrawal before changing target budget.")
		return TRUE

	var/department_id = params["department"]
	if(!(department_id in selectable_departments))
		return TRUE

	var/datum/bank_account/department/department_account = SSeconomy.get_dep_account(department_id)
	if(isnull(department_account))
		return TRUE

	account_department = department_id
	synced_bank_account = department_account
	return TRUE
