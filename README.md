# openapi-service-format


## Example Python Fastapi demo
```
class ActionResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
    
router = APIRouter(
    prefix="/users",
    tags=["users"],
)
@router.get("/current", response_model=ActionResponse[CurrentUserResponse])
async def get_current_user(current_user: UserModel = Depends(get_current_active_user), db: Session = Depends(get_db))
    ...
```

```
import api from '@/services';

const { data } = api.users.getCurrentUser();
if (data) {
    saveUserInfo(data);
}
```