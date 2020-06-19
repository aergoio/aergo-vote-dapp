state.var {
  councils = state.map(),
  agendas = state.map(),
  agenda_arr = state.array(),
  voters = state.map(2),
  statuses = state.value()
}

function init()
    if statuses:get() == nil then
        statuses:set({})
        _addStatus('open')
        _addStatus('closed')
    end
end

function addCouncil(council)
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    councils[council] = true
end

function removeCouncil(council)
    assert(system.getCreator() == system.getSender(), "only owner can call")
    councils:delete(council)
end

function issueAgenda(hash, aip, title, url, category, subCategory, startDate, endDate)
    assert(councils[system.getSender()] ~= nil, "only a council can issues an agenda")
    if agendas[hash] == nil then
        local d = system.date("*t", endDate)
        d.hour = 23
        d.min = 59
        d.sec = 59
        agenda_arr:append({
            ["hash"] = hash,
            ["aip"] = aip,
            ["title"] = title,
            ["url"] = url,
            issuer = system.getSender(),
            ["category"] = category,
            ["subCategory"] = subCategory,
            status = "open",
            ["startDate"] = startDate,
            ["endDate"] = system.time(d),
            confirm = bignum.number(0),
            reject = bignum.number(0)
        })
        agendas[hash] = agenda_arr:length()
    end
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
    local sender = system.getSender
    assert(agenda.issuer == sender, "'" .. sender .. "' is not the issuer")
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
    assert(agenda.status ~= 'closed', "agenda is closed: AIP-" .. agenda.aip)
    local now = system.getTimestamp()
    assert(agenda.startDate <= now, "voting has not started: AIP-" .. agenda.aip)
    assert(agenda.endDate >= now, "voting has ended: AIP-" .. agenda.aip)
    local voter = system.getSender()
    local stakingAmount = contract.balance(voter, "staking")
    assert(stakingAmount > bignum.number(0), "staking balance is zero")
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

abi.register(
    init,
    addCouncil, removeCouncil,
    issueAgenda, finishAgenda, confirmAgenda, rejectAgenda)

abi.register_view(listAgendas, listStatus)

