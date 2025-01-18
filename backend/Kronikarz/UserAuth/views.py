from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['create']:  # Allow anyone to create a user
            return [AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:  # Require authentication for edit/delete
            return [IsAuthenticated()]
        return [IsAuthenticated()]  # Default to authenticated for other actions (e.g., list/retrieve)

    def destroy(self, request, *args, **kwargs):
        # Optional: Prevent users from deleting other accounts
        user = self.get_object()
        if request.user != user:
            return Response({'detail': 'Cannot delete another user.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs) 



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
