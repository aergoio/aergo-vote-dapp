state.var {
  councilors = state.map(),
  councilor_arr = state.array(),
  agendas = state.map(),
  agenda_arr = state.array(),
  voters = state.map(2),
  statuses = state.value()
}

function _checkOwner()
    assert(system.getCreator() == system.getSender(), "only owner can call")
end

function init()
    _checkOwner()
    if statuses:get() == nil then
        statuses:set({})
        _addStatus("open")
        _addStatus("closed")
    end
end

function addCouncilor(councilor)
    _checkOwner()
    if not isCouncilor(councilor) then
        councilor_arr:append(councilor)
        councilors[councilor] = councilor_arr:length()
    end
end

function removeCouncilor(councilor)
    _checkOwner()
    local i = councilors[councilor]
    if i ~= nil then
        councilors:delete(councilor)
        councilor_arr[i] = nil
    end
end

function issueAgenda(hash, aip, title, url, category, subCategory, startDate, endDate)
    local sender = system.getSender()
    assert(isCouncilor(sender), "only a councilor can issues an agenda")
    local agenda = _getAgenda(hash)
    if agenda ~= nil then
        error("agenda already exists: AIP-" .. agenda.aip)
    end
    assert(startDate < endDate, "invalid argument: startDate(" .. startDate .. ") >= endDate(" .. endDate .. ")")
    agenda_arr:append({
        ["hash"] = hash,
        ["aip"] = aip,
        ["title"] = title,
        ["url"] = url,
        issuer = sender,
        ["category"] = category,
        ["subCategory"] = subCategory,
        status = "open",
        ["startDate"] = startDate,
        ["endDate"] = endDate,
        confirm = bignum.number(0),
        reject = bignum.number(0)
    })
    agendas[hash] = agenda_arr:length()
end

function _getAgenda(hash)
    local i = agendas[hash]
    if i == nil then
        return nil
    end
    return agenda_arr[i]
end

function _setAgenda(hash, agenda)
    local i = agendas[hash]
    if i ~= nil then
        agenda_arr[i] = agenda
    end
end

function finishAgenda(hash)
    local agenda = _getAgenda(hash)
    assert(agenda ~= nil, "not found the agenda: " .. hash)
    local sender = system.getSender()
    assert(isCouncilor(sender), "'" .. sender .. "' is not a councilor")
    agenda.status = "closed"
    _setAgenda(hash, agenda)
end

function confirmAgenda(hash)
    _voteAgenda(hash, "confirm")
end

function rejectAgenda(hash)
    _voteAgenda(hash, "reject")
end

function _voteAgenda(hash, key)
    local agenda = _getAgenda(hash)
    assert(agenda ~= nil, "not found the agenda: " .. hash)
    assert(agenda.status ~= "closed", "agenda is closed: AIP-" .. agenda.aip)
    local now = system.getTimestamp()
    assert(agenda.startDate <= now, "voting has not started: AIP-" .. agenda.aip)
    assert(agenda.endDate >= now, "voting has ended: AIP-" .. agenda.aip)
    local voter = system.getSender()
    local stakingAmount = contract.balance(voter, "staking")
    assert(stakingAmount > bignum.number(0), "staked amount is zero")
    assert(voters[hash][voter] == nil, "you voted: " .. voter)
    voters[hash][voter] = true
    agenda[key] = agenda[key] + stakingAmount
    _setAgenda(hash, agenda)
end

function listAgendas()
    local arr = {}
    for i, v in agenda_arr:ipairs() do
        table.insert(arr, v)
    end
    return arr
end

function listStatus()
    return _keys(statuses:get())
end

function _keys(h)
    local arr = {}
    for k, v in pairs(h) do
        table.insert(arr, k)
    end
    return arr
end

function _addStatus(status)
    local h = statuses:get()
    h[status] = true
    statuses:set(h)
end

function checkDelegation(fname, ...)
    if fname == "addCouncilor" or fname == "removeCouncilor" then
        return system.getCreator() == system.getSender()
    elseif fname == "issueAgenda" or fname == "finishAgenda" then
        return isCouncilor(system.getSender())
    elseif fname == "confirmAgenda" or fname == "rejectAgenda" then
        local hash = ...
        local agenda = _getAgenda(hash)
        if agenda == nil then
            return false
        end
        if agenda.status == "closed" then
            return false
        end
        local now = system.getTimestamp()
        if agenda.startDate > now or agenda.endDate < now then
            return false
        end
        local voter = system.getSender()
        if voters[hash][voter] ~= nil then
            return false
        end
        return contract.balance(voter, "staking") > bignum.number(0)
    end
    return false
end

function alreadyVoted(hash, voter)
    if _getAgenda(hash) == nil then
        return false
    end
    return voters[hash][voter] ~= nil
end

function isCouncilor(councilor)
    return councilors[councilor] ~= nil
end

function listCouncilors()
    local arr = {}
    for i, v in councilor_arr:ipairs() do
        if v ~= nil then
            table.insert(arr, v)
        end
    end
    return arr
end

abi.register(
    init,
    addCouncilor, removeCouncilor,
    issueAgenda, finishAgenda, confirmAgenda, rejectAgenda,
    checkDelegation)

abi.register_view(listAgendas, listStatus, alreadyVoted, isCouncilor, listCouncilors)

