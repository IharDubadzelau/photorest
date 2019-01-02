package snik.photorest.controller;

import org.springframework.web.bind.annotation.*;
import snik.photorest.exceptions.NotFoundException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("message")
public class MessageController {

    private int counter = 4;

    private List<Map<String,String>> messages = new ArrayList<Map<String,String>>() {{
        add(new HashMap<String, String>() {{put("id","1"); put("text","First message"); }});
        add(new HashMap<String, String>() {{put("id","2"); put("text","Second message"); }});
        add(new HashMap<String, String>() {{put("id","3"); put("text","Third message"); }});

    }};

    @GetMapping
    public List<Map<String,String>> list() {
        return messages;
    }

    @GetMapping("{id}")
    public Map<String,String> getOn(@PathVariable String id) {
        return getMessage(id);
    }

    private Map<String, String> getMessage(@PathVariable String id) {
        return messages.stream()
                .filter(m -> m.get("id").equals(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }

    /**
     * Methods for tests in the browser
     *
     * fetch('/message',{method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify({ text: 'Fourth message (4)', id: 10 })}).then(result => console.log(result))
     * fetch('/message/4',{method: 'PUT',headers: { 'Content-Type': 'application/json' },body: JSON.stringify({ text: 'Fourth message Update', id: 10 })}).then(result => console.log(result))
     * fetch('/message/4',{method: 'DELETE'}).then(result => console.log(result))
     **/


    @PostMapping
    public Map<String,String> create(@RequestBody Map<String,String> message) {
        message.put("id", String.valueOf(counter++));

        messages.add(message);

        return message;
    }

    @PutMapping("{id}")
    public Map<String,String> update(@PathVariable String id, @RequestBody Map<String,String> message) {

        Map<String, String> messageFromDB = getMessage(id);

        messageFromDB.putAll(message);
        messageFromDB.put("id",id);

        return messageFromDB;
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable String id) {

        Map<String, String> message = getMessage(id);

        messages.remove(message);
    }
}
