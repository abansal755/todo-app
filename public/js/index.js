const container = document.querySelector('#container');
const addForm = document.querySelector('#add-form');
const formInput = document.querySelector('#form-input');

function makeAlert(message,status){
    const div = document.createElement('div');
    div.classList.add('row','mt-2');
    div.innerHTML = `
                    <div class="col-md-6">
                        <div class="alert alert-danger mb-0 alert-dismissible fade show">
                            <h2 class="h4 alert-heading">${status}</h2>
                            <p>${message}</p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    </div>`;
    return div;
};

addForm.addEventListener('submit',async function(e){
    try{
        e.preventDefault();
        const res = await fetch('/todos',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `text=${formInput.value}`
        });
        if(!res.ok){
            const message  = await res.text();
            container.append(makeAlert(message,res.status));
        }else{
            const data = await res.json();
            container.append(makeTodo(data));
            formInput.value = '';
        }
    }catch{
        container.append(makeAlert('Internal server error',500));
    }
});

function makeTodo(todo){
    function getCompleteBtnFromDiv(div){
        return div.children[0].children[0].children[1].children[0];
    };
    function getFormFromBtn(btn){
        return btn.parentElement.parentElement.children[0].children[0];
    };
    function getDivFromBtn(btn){
        return btn.parentElement.parentElement.parentElement.parentElement;
    };
    function getFormFromDiv(div){
        return div.children[0].children[0].children[0].children[0];
    };
    function getDivFromForm(form){
        return form.parentElement.parentElement.parentElement.parentElement;
    };
    function toggleCompleteDisplay(btn){
        const form = getFormFromBtn(btn);
        if(btn.textContent==='Complete') btn.textContent='Completed';
        else btn.textContent='Complete'
        form.classList.toggle('complete');
    };
    async function toggleComplete(btn){
        try{
            const res = await fetch(`/todos/${getDivFromBtn(btn).dataset.id}`,{
                method:'PATCH',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                body:`isCompleted=${btn.textContent==='Completed'?'false':'true'}`
            });
            if(res.ok) toggleCompleteDisplay(btn);
            else{
                const message  = await res.text();
                container.append(makeAlert(message,res.status));
            }
        }catch{
            container.append(makeAlert('Internal server error',500));
        }
    };
    async function deleteTodo(btn){
        try{
            const div = getDivFromBtn(btn);
            const id = div.dataset.id;
            const res = await fetch(`/todos/${id}`,{
                method: 'DELETE'
            });
            if(res.ok) div.remove();
            else{
                const message  = await res.text();
                container.append(makeAlert(message,res.status));
            }
        }catch{
            container.append(makeAlert('Internal server error',500));
        }
    };

    const div = document.createElement('div');
    div.classList.add('row','mt-2');
    div.dataset.id = todo._id;
    div.innerHTML = `
                    <div class="col-md-6">
                        <div class="alert alert-light mb-0 d-flex">
                            <form class="me-2 flex-grow-1">
                                <textarea class="form-control">${todo.text}</textarea>
                            </form>
                            <div class="flex-shrink-0">
                                <button class="ms-2 me-2 flex-grow-1 btn btn-warning complete-btn">Complete</button>
                                <button class="flex-grow-1 btn btn-danger delete-btn">Delete</button>
                            </div>
                        </div>
                    </div>`;
    if(todo.isCompleted){
        const btn = getCompleteBtnFromDiv(div);
        toggleCompleteDisplay(btn);
    };
    div.addEventListener('click',function(e){
        if(e.target.classList.contains('complete-btn')) toggleComplete(e.target);
        if(e.target.classList.contains('delete-btn')) deleteTodo(e.target);
    });
    getFormFromDiv(div).addEventListener('change',async function(){
        try{
            const res = await fetch(`/todos/${getDivFromForm(this).dataset.id}`,{
                method:'PATCH',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                body:`text=${this.value}`
            });
            if(!res.ok){
                const message  = await res.text();
                container.append(makeAlert(message,res.status));
            }
        }catch{
            container.append(makeAlert('Internal server error',500));
        }
    });
    return div;
};

(async function(){
    const res = await fetch('/todos');
    const todos = await res.json();
    for(todo of todos) container.append(makeTodo(todo));
})();